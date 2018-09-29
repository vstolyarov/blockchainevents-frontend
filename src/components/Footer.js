import './Footer.styl';

import React from 'react'
import { Link } from 'react-router-dom'
import { Container, List, Icon } from 'semantic-ui-react'

export default Footer = () => (
  <div className='Footer'>
    <Container text textAlign='center'>
      <List horizontal divided link>
        <List.Item>BlockchainEvent.co &copy; {(new Date()).getFullYear()}</List.Item>
        <List.Item as={Link} to='/submit'>
          Submit an Event
        </List.Item>
      </List>
    </Container>
  </div>
)
