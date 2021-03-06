import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card } from 'antd'
import * as Actions from '@/store/actions'

function mapStateToProps(state, ownProps) {
    return {
        stations : state.stations
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setCurrentStation : (id) => {
            dispatch(Actions.setCurrentStation(id))
        }
    }
}

class ChooseStation extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	list : this.getList(this.props)
	  }
	}
	setCurrentStation(id) {
		this.props.setCurrentStation(id)
	}
	getList(props) {
		let list = [];
		for (let key in props.stations) {
			list.push(
				<li key={key}><a onClick={() => this.setCurrentStation(key)}>{props.stations[key].domainName}</a></li>
			)
		}
		return list
	}
	render() {
		return (
			<div className="choose-content">
				<Card title="请选择一个站点" className="choose-box">
					<ul>{this.state.list}</ul>
				</Card>
			</div>
		)
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			list : this.getList(nextProps)
		})
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseStation);