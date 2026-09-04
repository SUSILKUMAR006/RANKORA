import { useState } from 'react'
import { KeyRound, LogOut, ShieldCheck, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button.jsx'
import Card from '../common/Card.jsx'
import Modal from '../common/Modal.jsx'
import { authService } from '../../services/authService.js'

function AccountSection({ player }) {
  const navigate = useNavigate()
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)

  const handleConfirmLogout = async () => {
    setLogoutModalOpen(false)
    await authService.logout()
    navigate('/login')
  }

  return (
    <>
      <Card variant="glass" className="space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-rose-400/30 bg-rose-400/10 text-rose-300">
              <KeyRound size={17} />
            </span>
            <div>
              <p className="label-caps text-rose-300/80">SESSION & CREDENTIALS</p>
              <h2 className="font-display text-base font-semibold text-white">
                ACCOUNT
              </h2>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-semibold text-white">
                {player?.playerName || 'PLAYER'}
              </span>
              <span className="rounded bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 font-mono text-[0.62rem] text-cyan-200 uppercase">
                LVL {player?.level || 17} · RANK {player?.rank || 'C'}
              </span>
            </div>
            <p className="font-mono text-xs text-slate-500">
              Active local session · System operational
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={() => setLogoutModalOpen(true)}
            className="text-xs"
          >
            <LogOut size={14} /> LOGOUT
          </Button>
        </div>
      </Card>

      {/* Logout Confirmation Modal */}
      <Modal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="DISCONNECT SESSION?"
        eyebrow="RANKORA SYSTEM"
        footer={
          <>
            <Button variant="ghost" onClick={() => setLogoutModalOpen(false)}>
              CANCEL
            </Button>
            <Button variant="danger" onClick={handleConfirmLogout}>
              <LogOut size={15} /> CONFIRM LOGOUT
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-slate-300">
          You are about to log out of your active RANKORA session. All progress data
          remains safely preserved in your local browser storage.
        </p>
      </Modal>
    </>
  )
}

export default AccountSection
