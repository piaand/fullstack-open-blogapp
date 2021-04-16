import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody
} from '@material-ui/core'

const UserRow = ({ lister, blogs, address }) => (
	<TableRow>
		<TableCell>
			<Link to={address}>{lister.name}</Link></TableCell>
		<TableCell>{blogs && blogs.length}</TableCell>
	</TableRow>
)

const UserCollection = () => {
	const listers = useSelector(state => state.listers)
	const baseAddress = '/users/'
	if(!listers) {
		return null
	}
	return (
		<TableContainer>
			<h2>Users</h2>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell></TableCell>
						<TableCell>Blogs created</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{listers.map(lister =>
						<UserRow
							key={lister.id}
							lister={lister}
							blogs={lister.blogs}
							address={baseAddress + lister.id}/>)}
				</TableBody>
			</Table>
		</TableContainer>)
}

export default UserCollection