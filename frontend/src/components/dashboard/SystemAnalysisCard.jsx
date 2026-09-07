import SystemAnalysisPanel from '../analysis/SystemAnalysisPanel.jsx'

function SystemAnalysisCard({ analysis, className = '' }) {
  return <SystemAnalysisPanel analysis={analysis} className={className} />
}

export default SystemAnalysisCard
