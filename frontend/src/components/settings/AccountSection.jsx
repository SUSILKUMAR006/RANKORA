import { useState } from 'react'
import { KeyRound, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button.jsx'
import Modal from '../common/Modal.jsx'
import SystemWindow from '../common/SystemWindow.jsx'
import RankBadge from '../player/RankBadge.jsx'
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
      <SystemWindow
        title="Account"
        icon={<KeyRound size={13} />}
        actions={<span className="label-caps hidden text-frost-600 sm:inline">Session & credentials</span>}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <RankBadge rank={player?.rank || 'C'} size="md" />
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="truncate font-display text-base font-bold uppercase tracking-[0.08em] text-frost-50">
                  {player?.playerName || 'PLAYER'}
                </span>
                <span className="border border-system-400/50 bg-system-500/10 px-2 py-0.5 font-mono text-[0.62rem] uppercase text-system-200">
                  LVL {player?.level || 17} · RANK {player?.rank || 'C'}
                </span>
              </div>
              <p className="flex items-center gap-2 font-mono text-xs text-frost-500">
                <span className="h-1.5 w-1.5 animate-sys-pulse bg-clear-400 shadow-[0_0_6px_rgba(52,217,156,0.9)]" />
                Active local session · System operational
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="danger"
            onClick={() => setLogoutModalOpen(true)}
            className="w-full text-xs sm:w-auto"
          >
            <LogOut size={14} /> LOGOUT
          </Button>
        </div>
      </SystemWindow>

      {/* Logout Confirmation Modal */}
      <Modal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="DISCONNECT SESSION?"
        eyebrow="Rankora System"
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
        <p className="text-sm leading-6 text-frost-200">
          You are about to log out of your active RANKORA session. All progress data
          remains safely preserved in your local browser storage.
        </p>
      </Modal>
    </>
  )
}

export default AccountSection
