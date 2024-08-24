'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import Profile from '@components/Profile'

const MyProfile = () => {
	const { data: session } = useSession()
	const router = useRouter()
	const [posts, setPosts] = useState([])

	useEffect(() => {
		const fetchPosts = async () => {
			const response = await fetch(
				`/api/users/${session?.user.id}/posts`
			)
			const data = await response.json()
			console.log(data)
			setPosts(data)
		}

		if (session?.user.id) {
			fetchPosts()
		}
	}, [session?.user.id])

	const handleEdit = (post) => {
		router.push(`/update-prompt?id=${post._id}`)
	}

	const handleDelete = async (post) => {
		const hasConfirmed = confirm(
			'Are you sure you want to delete this prompt?'
		)

		if (hasConfirmed) {
			console.log(post._id + 'has confirmed')
			try {
				await fetch(`/api/prompt/${post._id.toString()}`, {
					method: 'DELETE',
				})

				const filteredPosts = posts.filter((p) => p._id !== post._id)

				setPosts(filteredPosts)
			} catch (error) {
				console.log(error)
			}
		}
	}

	return (
		<Profile
			name='My'
			desc='welcome to your personalised profile page'
			data={posts}
			handleEdit={handleEdit}
			handleDelete={handleDelete}
		>
			<h1 className='text-3xl blue_gradient text-left'>My Profile</h1>
			<p className='mt-2 text-left'>
				Welcome to your personalized profile page. Share your
				exeptional prompts and inspire others with the power of your
				imagination.
			</p>
		</Profile>
	)
}

export default MyProfile
