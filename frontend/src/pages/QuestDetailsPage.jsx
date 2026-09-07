import { motion } from 'framer-motion'
import { Terminal } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import Modal from '../components/common/Modal.jsx'
import { ErrorState } from '../components/common/States.jsx'
import SystemMessage from '../components/common/SystemMessage.jsx'
import CompleteQuestModal from '../components/quests/CompleteQuestModal.jsx'
import FailureHistory from '../components/quests/FailureHistory.jsx'
import FailureResult from '../components/quests/FailureResult.jsx'
import QuestCompletionSuccess from '../components/quests/QuestCompletionSuccess.jsx'
import QuestFailureModal from '../components/quests/QuestFailureModal.jsx'
import QuestVerificationModal from '../components/quests/QuestVerificationModal.jsx'
import VerificationPending from '../components/quests/VerificationPending.jsx'
import XPRewardAnimation from '../components/quests/XPRewardAnimation.jsx'
import FailureSummary from '../components/quests/details/FailureSummary.jsx'
import QuestDetailsHeader from '../components/quests/details/QuestDetailsHeader.jsx'
import QuestHistory from '../components/quests/details/QuestHistory.jsx'
import QuestInformation from '../components/quests/details/QuestInformation.jsx'
import QuestMissionBrief from '../components/quests/details/QuestMissionBrief.jsx'
import QuestObjective from '../components/quests/details/QuestObjective.jsx'
import QuestProgress from '../components/quests/details/QuestProgress.jsx'
import QuestReward from '../components/quests/details/QuestReward.jsx'
import RelatedQuests from '../components/quests/details/RelatedQuests.jsx'
import { mockQuests } from '../data/mockQuests.js'
import { useQuestCompletion } from '../hooks/useQuestCompletion.js'
import { useQuestFailure } from '../hooks/useQuestFailure.js'
import { useQuestVerification } from '../hooks/useQuestVerification.js'
import { questService } from '../services/questService.js'

function QuestDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { quest, complete, refresh } = useQuestCompletion(id)
  const { submit: submitVerification } = useQuestVerification(id)
  const { record: recordFailure } = useQuestFailure(id)
  const [actionState, setActionState] = useState('idle')
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [verificationOpen, setVerificationOpen] = useState(false)
  const [failureOpen, setFailureOpen] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [failureProcessing, setFailureProcessing] = useState(false)
  const [rewardVisible, setRewardVisible] = useState(false)
  const [levelUp, setLevelUp] = useState(null)
  const [failureRecorded, setFailureRecorded] = useState(false)

  if (!quest)
    return (
      <div className="mx-auto max-w-xl py-16">
        <ErrorState
          title="QUEST NOT FOUND"
          description="The requested objective does not exist."
        />
        <button
          type="button"
          onClick={() => navigate('/quests')}
          className="mx-auto mt-6 block rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-300/30 hover:text-cyan-200"
        >
          RETURN TO QUESTS
        </button>
      </div>
    )

  const isGym =
    quest.id === 'gym-workout' || quest.title?.toLowerCase().includes('gym')
  const requiresVerification =
    isGym || (quest.verification && String(quest.verification).toLowerCase() !== 'none')

  const related = mockQuests
    .filter((item) => item.id !== quest.id && item.category === quest.category)
    .slice(0, 3)

  const handleAction = () => {
    if (
      quest.status === 'completed' ||
      quest.status === 'failed' ||
      quest.status === 'pending_verification'
    )
      return
    if (requiresVerification) setVerificationOpen(true)
    else setConfirmationOpen(true)
  }

  const confirmCompletion = () => {
    setProcessing(true)
    window.setTimeout(() => {
      const result = complete()
      setProcessing(false)
      setConfirmationOpen(false)
      if (result.error) {
        setActionState('error')
        return
      }
      if (result.alreadyCompleted || result.requiresVerification) return
      setRewardVisible(true)
      window.setTimeout(() => setRewardVisible(false), 1200)
      if (result.leveledUp)
        setLevelUp({
          previousLevel: result.previousLevel,
          newLevel: result.newLevel,
          gainedXp: result.gainedXp,
          statReward: result.reward,
        })
    }, 300)
  }

  const confirmFailure = (payload) => {
    setFailureProcessing(true)
    window.setTimeout(() => {
      const result = recordFailure(payload)
      setFailureProcessing(false)
      if (result.error) {
        setActionState('error')
        return
      }
      refresh()
      setFailureRecorded(true)
    }, 300)
  }

  const handleVerificationSubmitted = (payload) => {
    const result = complete({ bypassVerification: true, proof: payload })
    questService.verifyQuest(quest.id || quest._id, payload).catch(() => {})
    if (result && !result.error) {
      setRewardVisible(true)
      window.setTimeout(() => setRewardVisible(false), 1200)
      if (result.leveledUp) {
        setLevelUp({
          previousLevel: result.previousLevel,
          newLevel: result.newLevel,
          gainedXp: result.gainedXp,
          statReward: result.reward,
        })
      }
    }
    refresh()
  }

  return (
    <div className="space-y-6 pb-10">
      <XPRewardAnimation amount={quest.xp} visible={rewardVisible} />
      <QuestDetailsHeader
        quest={quest}
        onBack={() => navigate('/quests')}
        onAction={handleAction}
        onFailure={() => setFailureOpen(true)}
      />
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="min-w-0 space-y-6"
        >
          {quest.status === 'completed' && (
            <QuestCompletionSuccess quest={quest} levelUp={Boolean(levelUp)} />
          )}
          {quest.status === 'failed' && <FailureResult quest={quest} />}
          {quest.status === 'pending_verification' && <VerificationPending />}
          {actionState === 'error' && (
            <Card
              variant="standard"
              className="border-rose-300/20 bg-rose-400/[0.04]"
            >
              <p className="label-caps text-rose-200/80">SYSTEM ERROR</p>
              <p className="mt-2 text-sm text-slate-400">
                Quest data could not be located.
              </p>
            </Card>
          )}
          {failureRecorded && quest.status === 'failed' && (
            <SystemMessage
              eyebrow="RANKORA SYSTEM"
              title="MISSION FAILURE RECORDED"
              message="Failure data has been stored for future analysis."
            />
          )}
          <QuestMissionBrief description={quest.description} />
          <QuestObjective quest={quest} />
          <QuestProgress quest={quest} />
          <SystemMessage
            eyebrow="RANKORA SYSTEM"
            title={
              quest.status === 'completed'
                ? 'MISSION COMPLETE'
                : quest.status === 'failed'
                ? 'DATA RECORDED'
                : quest.status === 'pending_verification'
                ? 'AWAITING VERIFICATION'
                : 'OBJECTIVE DETECTED'
            }
            message={
              quest.status === 'completed'
                ? 'Rewards have been added to your profile.'
                : quest.status === 'failed'
                ? 'Failure is feedback. Use the record to improve the next attempt.'
                : quest.status === 'pending_verification'
                ? 'Verification request transmitted.'
                : requiresVerification
                ? 'Gym workout proof photo required before completion.'
                : "Complete this quest before today's cycle ends."
            }
          />
          <QuestHistory history={quest.history} />
          <FailureSummary questId={quest.id} history={quest.history} />
          <FailureHistory history={quest.history} />
          {related.length > 0 && <RelatedQuests quests={related} />}
        </motion.div>
        <motion.aside
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="min-w-0 space-y-6 xl:sticky xl:top-24 xl:self-start"
        >
          <QuestReward quest={quest} />
          <QuestInformation quest={quest} />
          {!requiresVerification &&
          quest.status !== 'failed' &&
          quest.status !== 'pending_verification' ? (
            <Card
              variant="standard"
              className="border-cyan-300/15 bg-cyan-300/[0.03]"
            >
              <p className="label-caps text-cyan-200/70">COMPLETION PROTOCOL</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Confirm this objective when your mission is complete.
              </p>
            </Card>
          ) : null}
          <Card variant="standard" className="hidden xl:block">
            <p className="flex items-center gap-2 label-caps text-slate-600">
              <Terminal size={14} />
              Mission protocol
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Review the objective parameters before beginning your run.
            </p>
          </Card>
        </motion.aside>
      </div>
      <CompleteQuestModal
        quest={quest}
        open={confirmationOpen}
        processing={processing}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={confirmCompletion}
      />
      <QuestVerificationModal
        key={verificationOpen ? 'verification-open' : 'verification-closed'}
        quest={quest}
        open={verificationOpen}
        onClose={() => {
          setVerificationOpen(false)
          refresh()
        }}
        onVerified={handleVerificationSubmitted}
        onSubmitted={handleVerificationSubmitted}
      />
      <QuestFailureModal
        key={failureOpen ? 'failure-open' : 'failure-closed'}
        quest={quest}
        open={failureOpen}
        processing={failureProcessing}
        submitted={failureRecorded}
        onClose={() => setFailureOpen(false)}
        onConfirm={confirmFailure}
      />
      {levelUp && (
        <Modal
          open
          title="LEVEL UP"
          eyebrow="RANKORA SYSTEM"
          onClose={() => setLevelUp(null)}
          footer={<Button onClick={() => setLevelUp(null)}>CONTINUE</Button>}
        >
          <div className="text-center">
            <p className="font-mono text-4xl text-cyan-200">
              LEVEL {levelUp.newLevel}
            </p>
            <p className="mt-3 text-slate-400">Your power has increased.</p>
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
              <div>
                <p className="label-caps text-slate-600">Previous</p>
                <p className="mt-2 font-mono text-xl text-white">
                  {levelUp.previousLevel}
                </p>
              </div>
              <div>
                <p className="label-caps text-slate-600">New level</p>
                <p className="mt-2 font-mono text-xl text-cyan-200">
                  {levelUp.newLevel}
                </p>
              </div>
              <div>
                <p className="label-caps text-slate-600">XP gained</p>
                <p className="mt-2 font-mono text-xl text-amber-200">
                  +{levelUp.gainedXp}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default QuestDetailsPage
