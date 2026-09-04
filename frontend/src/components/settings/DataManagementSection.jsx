import { useState } from 'react'
import {
  AlertTriangle,
  Check,
  Database,
  Download,
  FileJson,
  HardDrive,
  Trash2,
} from 'lucide-react'
import Button from '../common/Button.jsx'
import Card from '../common/Card.jsx'
import Modal from '../common/Modal.jsx'
import { clearAllRankoraData, exportAllRankoraData } from '../../utils/settingsUtils.js'

function DataManagementSection({ onDataCleared }) {
  const [exportSuccess, setExportSuccess] = useState(false)
  const [clearModalOpen, setClearModalOpen] = useState(false)

  const handleExport = () => {
    const success = exportAllRankoraData()
    if (success) {
      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 3000)
    }
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
      <Card variant="glass" className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-cyan-300/30 bg-cyan-400/10 text-cyan-200">
              <Database size={17} />
            </span>
            <div>
              <p className="label-caps text-cyan-300/80">BACKUP & LOCAL STORAGE</p>
              <h2 className="font-display text-base font-semibold text-white">
                DATA MANAGEMENT
              </h2>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Export JSON Card */}
          <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20">
            <div>
              <div className="flex items-center gap-2 text-cyan-200">
                <FileJson size={18} />
                <h3 className="font-display text-xs font-semibold text-white uppercase tracking-wider">
                  Export Data JSON
                </h3>
              </div>
              <p className="mt-2 text-[0.72rem] leading-relaxed text-slate-400">
                Download a complete, offline JSON snapshot of your quests, XP trajectory,
                achievements, failure history, and weekly boss progress.
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Button
                type="button"
                variant="secondary"
                onClick={handleExport}
                className="w-full text-xs"
              >
                {exportSuccess ? (
                  <>
                    <Check size={14} className="text-emerald-300" /> DOWNLOADED
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
          <div className="flex flex-col justify-between rounded-xl border border-rose-400/20 bg-rose-950/10 p-4 transition hover:border-rose-400/30">
            <div>
              <div className="flex items-center gap-2 text-rose-300">
                <AlertTriangle size={18} />
                <h3 className="font-display text-xs font-semibold text-white uppercase tracking-wider">
                  Clear Local Data
                </h3>
              </div>
              <p className="mt-2 text-[0.72rem] leading-relaxed text-slate-400">
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
      </Card>

      {/* Confirmation Modal */}
      <Modal
        open={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        title="PURGE ALL LOCAL DATA?"
        eyebrow="CRITICAL SYSTEM ACTION"
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
          <p className="text-sm leading-relaxed text-slate-300">
            You are about to permanently erase all locally stored RANKORA data, including:
          </p>
          <ul className="list-disc space-y-1 pl-5 font-mono text-xs text-rose-200">
            <li>Player level, rank, and XP trajectory</li>
            <li>All completed and pending daily quests</li>
            <li>Unlocked honors and achievement codex entries</li>
            <li>Weekly boss progress and victory logs</li>
            <li>Private progress photos and timeline records</li>
          </ul>
          <p className="text-xs text-slate-500 pt-2">
            Tip: You can download a backup JSON above before proceeding.
          </p>
        </div>
      </Modal>
    </>
  )
}

export default DataManagementSection
