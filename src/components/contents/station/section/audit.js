import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Form, Select, TreeSelect, Row, Col, Collapse, Button, Card, Tag, List, Avatar, Pagination, Table, message } from 'antd'
import * as Actions from '@/store/actions'
import * as API from '@/fetch/index'
import Base from '@/config/base'
import Logo from '@/assets/logo.png';

function mapStateToProps(state, ownProps) {
    return {
		
    }
}

function mapDispatchToProps(dispatch) {
    return {
		
    }
}

class Audit extends Component {
	render() {
		return (<span>Audit</span>)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Audit)