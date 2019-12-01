import React from 'react'
import Avatar from 'react-avatar'

import './AvatarList.scss'

class AvatarList extends React.Component {
  renderUser = user => (
    <Avatar
      name={user}
      size={25}
      round
      key={user}
    />
  )
  render() {
    const { users, style } = this.props
    if (!users || users.length === 0) {
      return null
    }
    return (
      <div className="avatar-list" style={style}>
        {
          users.length > 3 ? (
            <>
              {users.slice(0, 3).map(this.renderUser)}
              <Avatar
                name={`+ ${users.length - 3}`}
                size={25}
                round
              />
            </>
          ) : users.map(this.renderUser)
        }
      </div>
    )
  }
}

export default AvatarList