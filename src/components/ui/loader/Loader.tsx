import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

export function Loader() {
  return (
    <div className="flex items-center justify-center py-4 gap-3">
      <FontAwesomeIcon
        icon={faCircleNotch}
        spin
        style={{ width: 24, height: 24 }}
        className="text-indigo-600 text-2xl"
        aria-label="Loading spinner"
      />
      <p className="text-gray-600 text-sm font-medium">Loading...</p>
    </div>
  )
}
