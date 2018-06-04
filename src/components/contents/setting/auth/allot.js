import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Form, Select, TreeSelect, Row, Col, Collapse, Button, Card, Tag, List, Avatar, Pagination, Table, message, Modal, Icon } from 'antd'
import * as Actions from '@/store/actions'
import * as API from '@/fetch/index'
import Base from '@/config/base'
import Md5 from 'md5'

function mapStateToProps(state, ownProps) {
    return {
		
    }
}

function mapDispatchToProps(dispatch) {
    return {
		
    }
}

class Allot extends Component {
    render() {
        return (<div>
            allot
        </div>)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Allot)