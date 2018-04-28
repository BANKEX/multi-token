import React, { Component, PropTypes } from 'react'
import DocumentTitle from 'react-document-title'
import { config } from 'config'
import Contract from '../components/contract';

export default class Json extends Component {
  render() {
    const contract = this.props.route.page.data
    return (
      <DocumentTitle title={`${contract.name} | ${config.name}`}>
        <Contract contract={contract} />
      </DocumentTitle>
    )
  }
}

Json.propTypes = {
  route: PropTypes.object,
}
