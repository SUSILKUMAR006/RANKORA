import { useState } from 'react'
import {
  AlertTriangle,
  Check,
  Database,
  Download,
  FileJson,
  RotateCcw,
  Swords,
  Trash2,
} from 'lucide-react'
import Button from '../common/Button.jsx'
import Modal from '../common/Modal.jsx'
import SystemWindow from '../common/SystemWindow.jsx'
import { clearAllRankoraData, exportAllRankoraData } from '../../utils/settingsUtils.js'
import { restoreDefaultQuests } from '../../hooks/useQuestCompletion.js'

function DataManagementSection({ onDataCleared }) {
  const [exportSuccess, setExportSuccess] = useState(false)
  const [restoreSuccess, setRestoreSuccess] = useState(false)
  const [clearModalOpen, setClearModalOpen] = useState(false)

  const handleExport = () => {
    const success = exportAllRankoraData()
    if (success) {
      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 3000)
    }
  }

  const handleRestoreQuests = () => {
    restoreDefaultQuests()
    setRestoreSuccess(true)
    setTimeout(() => setRestoreSuccess(false), 3000)
  }

  const handleConfirmClear = () => {
    clearAllRankoraData()
    setClearModalOpen(false)
    if (onDataCleared) {
      onDataCleared()
    } else {
      window.location.href = '/awakening'
    }
  }

  return (
    <>
      <SystemWindow
        title="Data Management"
        icon={<Database size={13} />}
        actions={<span className="label-caps hidden text-frost-600 sm:inline">Backup & local storage</span>}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {/* Restore Defaults Card */}
          <div className="sys-inset flex flex-col justify-between p-4 transition-colors hover:border-edge-strong">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center border border-system-400/70 text-system-200">
                  <Swords size={14} />
                </span>
                <h3 className="font-display text-sm font-bold uppercase tracking-[0.08em] text-frost-50">
                  Restore Default Quests
                </h3>
              </div>
              <p className="mt-3 text-xs leading-5 text-frost-400">
                Restore the 7 standard daily discipline routine quests to their default configuration
                without wiping your player stats.
              </p>
            </div>

            <div className="mt-4">
              <Button
                type="button"
                variant={restoreSuccess ? 'success' : 'secondary'}
                onClick={handleRestoreQuests}
                className="w-full text-xs"
              >
                {restoreSuccess ? (
                  <>
                    <Check size={14} /> RESTORED
                  </>
                ) : (
                  <>
                    <RotateCcw size={14} /> RESTORE DEFAULTS
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Export JSON Card */}
          <div className="sys-inset flex flex-col justify-between p-4 transition-colors hover:border-edge-strong">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center border border-system-400/70 text-system-200">
                  <FileJson size={14} />
                </span>
                <h3 className="font-display text-sm font-bold uppercase tracking-[0.08em] text-frost-50">
                  Export Data JSON
                </h3>
              </div>
              <p className="mt-3 text-xs leading-5 text-frost-400">
                Download a complete, offline JSON snapshot of your quests, XP trajectory,
                achievements, failure history, and weekly boss progress.
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Button
                type="button"
                variant={exportSuccess ? 'success' : 'secondary'}
                onClick={handleExport}
                className="w-full text-xs"
              >
                {exportSuccess ? (
                  <>
                    <Check size={14} /> DOWNLOADED
                  </>
                ) : (
                  <>
                    <Download size={14} /> EXPORT BACKUP JSON
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Clear Data Card */}
          <div className="flex flex-col justify-between rounded-xs border border-penalty-500/40 bg-penalty-500/5 p-4 transition-colors hover:border-penalty-400/60">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center border border-penalty-400/80 text-penalty-300">
                  <AlertTriangle size={14} />
                </span>
                <h3 className="font-display text-sm font-bold uppercase tracking-[0.08em] text-frost-50">
                  Clear Local Data
                </h3>
              </div>
              <p className="mt-3 text-xs leading-5 text-frost-400">
                <span className="font-display font-bold uppercase tracking-[0.12em] text-penalty-300">Warning: </span>
                Permanently purge all local progress records, quest logs, and achievements.
                This action is irreversible and resets your system to awakening state.
              </p>
            </div>

            <div className="mt-4">
              <Button
                type="button"
                variant="danger"
                onClick={() => setClearModalOpen(true)}
                className="w-full text-xs"
              >
                <Trash2 size={14} /> CLEAR ALL DATA
              </Button>
            </div>
          </div>
        </div>
      </SystemWindow>

      {/* Confirmation Modal */}
      <Modal
        open={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        title="PURGE ALL LOCAL DATA?"
        eyebrow="Critical system action"
        tone="penalty"
        footer={
          <>
            <Button variant="ghost" onClick={() => setClearModalOpen(false)}>
              CANCEL
            </Button>
            <Button variant="danger" onClick={handleConfirmClear}>
              <Trash2 size={15} /> CONFIRM PURGE
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm leading-6 text-frost-200">
            You are about to permanently erase all locally stored RANKORA data, including:
          </p>
          <ul className="sys-inset space-y-1.5 px-4 py-3 font-mono text-xs text-penalty-200">
            {[
              'Player level, rank, and XP trajectory',
              'All completed and pending daily quests',
              'Unlocked honors and achievement codex entries',
              'Weekly boss progress and victory logs',
              'Private progress photos and timeline records',
            ].map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-penalty-400" />
                {line}
              </li>
            ))}
          </ul>
          <p className="pt-2 text-xs text-frost-500">
            Tip: You can download a backup JSON above before proceeding.
          </p>
        </div>
      </Modal>
    </>
  )
}

export default DataManagementSection
