import { ScrollText } from 'lucide-react'
import SystemWindow from '../../common/SystemWindow.jsx'

function QuestMissionBrief({ description }) {
  return (
    <SystemWindow title="Mission Brief" icon={<ScrollText size={13} />}>
      <p className="text-sm leading-7 text-frost-300 sm:text-base sm:leading-8">{description}</p>
    </SystemWindow>
  )
}
export default QuestMissionBrief
