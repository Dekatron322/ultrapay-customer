import React from "react"

export interface IconProps {
  className?: string
}

const GooglePlayIcon: React.FC<IconProps> = ({ className = "" }) => {
  return (
    <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.0847 13.4136L19.7549 10.7434L7.24919 3.53364L17.0847 13.4136ZM4.71243 2.95508C4.13388 3.26661 3.73334 3.84517 3.73334 4.55724V24.1837C3.73334 24.8958 4.13388 25.4743 4.71243 25.7413L16.1056 14.3482L4.71243 2.95508ZM23.6268 13.0131L21.001 11.4999L18.0638 14.3482L21.001 17.241L23.6713 15.7278C24.4724 15.1048 24.4724 13.6361 23.6268 13.0131ZM7.24919 25.1628L19.7549 17.9976L17.0847 15.3273L7.24919 25.1628Z"
        fill="white"
      />
    </svg>
  )
}

export default GooglePlayIcon
