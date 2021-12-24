import { useRouter } from 'next/router';
import Course from '../../models/Course';
import webRoutes from '../../helpers/webRoutes';
import isAuth from '../../middlewares/isAuth';

import { Box, Container } from '@mui/material';
import CourseList from '../../components/Course/CourseList';
import NoCourses from '../../components/Course/NoCourse';

const Dashboard = props => {
	const router = useRouter();
	const myCourses = JSON.parse(props.myCourses);
	const enrolledCourses = JSON.parse(props.enrolledCourses);

	const onClickCourse = course => {
		router.push(webRoutes.course(course._id).path);
	};

	return (
		<Container sx={{ my: 4 }}>
			{myCourses.length > 0 && (
				<CourseList
					title="Your Courses"
					courses={myCourses}
					onClick={onClickCourse}
				/>
			)}
			{enrolledCourses.length > 0 && (
				<CourseList
					title="Enrolled Courses"
					courses={enrolledCourses}
					onClick={onClickCourse}
				/>
			)}
			{myCourses.length === 0 && enrolledCourses.length === 0 && <NoCourses />}
			<Box height="10px" />
		</Container>
	);
};

export const getServerSideProps = isAuth(async (ctx, user) => {
	const myCourses = await Course.find({
		creator: user._id,
	});

	const enrolledCourses = await Course.find({
		_id: { $in: user.courses },
	});

	return {
		props: {
			user: JSON.stringify(user),
			myCourses: JSON.stringify(myCourses),
			enrolledCourses: JSON.stringify(enrolledCourses),
		},
	};
}, webRoutes.dashboard);

export default Dashboard;
