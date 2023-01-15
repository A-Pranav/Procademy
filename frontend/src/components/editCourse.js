import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom';
// import Navbar from './navbar';
import UserContext from "../contexts/userContext";
import AddVideo from './addVideo';


export default function EditCourse() {
	const [ isCreator, setIsCreator ] = useState(true);
	const [ videoCount, setVideoCount ] = useState(0);
	const { userData } = useContext(UserContext);
	const [ isLoading, setIsLoading ] = useState(true);
	const navigate = useNavigate();
	const { link } = useParams();

	const [ videos, setVideos ] = useState([]);
	const [ course, setCourse ] = useState({
		title: "",
		course_id: "",
		summary: "",
		creator: "",
		level: "",
		category: ""
		// enrollments: "",
		// duration: "",
		// rating: ""
	});
	useEffect(() => {
		setIsLoading(true);
		const fetcher = async () => {
			let response = await fetch(`http://localhost:9669/course/getCourse/${link}`, {
				method: "GET"
			});

			if (response.status == 200) {
				let data = await response.json();
				setCourse(data);
				course.title = data.title;
				course.summary = data.summary;
				course.course_id = data.course_id;
				course.creator = data.creatorName;
				course.level = data.level;
				course.category = data.category;
				setVideoCount(data.videos.length)
				// course.enrollments = data.enrollments;
				// course.duration = data.duration;
				// course.rating = data.rating;
				console.log("data", data);
				console.log("course", course);
				setIsLoading(false);
				checkCreator();
				GetAllVideos();
			}
		}


		const GetAllVideos = async () => {
			setIsLoading(true);
			let details={
				courseId: course.course_id
			};
			let response = await fetch(`http://localhost:9669/videos/listCourseVideos`, {
				method: "POST",
				headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json'
                },
                body: JSON.stringify(details)
			});

			if (response.status == 200) {
				let data = await response.json();
				setVideos(data);
				// setVideoCount(data.videos.length)
				// course.enrollments = data.enrollments;
				// course.duration = data.duration;
				// course.rating = data.rating;
				console.log("data", data);
				// console.log("course", course);
				setIsLoading(false);
			}
		}
		const checkCreator = async () => {
			setIsLoading(true);
			if (!userData.user) {
				navigate("/login");
			}
			let creator = {
				courseLink: link,
				userId: userData.user.id
			}
			// let response = await fetch(`http://localhost:9669/course/checkEnrolled/${link}`, {
			//     method: "GET"
			// });
			let response = await fetch(`http://localhost:9669/course/checkCreator`, {
				method: "POST",
				// mode: 'no-cors',
				headers: {
					"Content-Type": "application/json",
					'Accept': 'application/json'
				},
				body: JSON.stringify(creator)
			})
			// .then(resp => { console.log("this is resp=", resp) }).then(resp=>{return resp})
			let data = await response.json();
			console.log("checkcheckcheckcheck", data);
			if (response.status == 200) {
				if (data.isCreator == true) {
					console.log("truuuuuueeeeeeeee");
					setIsCreator(true);
					setIsLoading(false);
				}
				else if (data.isCreator == false) {
					setIsCreator(false);
					setIsLoading(false);
				}
			}
			// setCourse(data);
			// if (response.status == 404) {
			// setFound(0);
			// }
			// setIsLoading(false);
		};
		fetcher();
	}, []);
	const submitEditData = async (e) => {
		e.preventDefault();
		const newEdit = { ...course };
		console.log(newEdit);
		await fetch(`http://localhost:9669/course/updateCourse/${link}`, {
			method: "PUT",
			// mode: 'no-cors',
			headers: {
				"Content-Type": "application/json",
				'Accept': 'application/json'
			},
			body: JSON.stringify(newEdit)
		}).then(resp => { console.log("resp=", resp) })
	};
	if (isLoading) { return <div>Loading...</div>; }
	if (!isCreator) { return <div>Unauthorized</div>; }

	return (
		<>
			<div className='container'>
				EditCourse
				<br />
				<div>
					{/* <h2>ID={customId}</h2> */}
					<h3>Add new title</h3>
					< input type="text" name="name" id="e_name" placeholder="Enter Name Here"
						value={course.title}
						onChange={(e) => setCourse({ ...course, title: e.target.value })}
					/>
					<h3>Add new summary</h3>
					<textarea type="text" name="streetAddress" id="e_streetAddress" placeholder="Enter street Address Here"
						value={course.summary}
						onChange={(e) => setCourse({ ...course, summary: e.target.value })}
					/>
					<h3>Add new level</h3>
					<input type="text" name="pincode" id="e_pincode" placeholder="Enter pincode Here"
						value={course.level}
						onChange={(e) => setCourse({ ...course, level: e.target.level })}
					/>
					<h3>Add new category</h3>
					<input type="text" name="state" id="e_state" placeholder="Enter state Here"
						value={course.category}
						onChange={(e) => setCourse({ ...course, category: e.target.category })}
					/>
					<br />
					<br />
					<button type="submit" className="btn btn-primary" onClick={submitEditData}>Update</button>
				</div>
				<div>
					{(videoCount == 0) ?
						<>
							Course Doesnot Has Any Videos <br /> Please add
							<AddVideo courseId={course.course_id} videos={course.videos} />
						</>
						:
						<>
							<div>all videos</div>
							<table className="table table-light">
								<thead>
									<tr align="center">
										<th>Title</th>
										<th>discription</th>
										<th>Creator Name</th>
										<th>Likes</th>
										<th>video_link</th>
									</tr>
								</thead>
								<tbody>
									{
										course.map((course) => {
											console.log("<td>{course.custom_id}</td>", course.custom_id);
											return <tr>
												<th style={{ cursor: "pointer" }} ><Link to={"/course/" + course.link}><a>{course.title}</a></Link></th>
												<td>{course.summary}</td>
												<td>{course.creatorName}</td>
												<td>{course.level}</td>
												<td>{course.categories}</td>
												<td>{course.enrollments}</td>
												<td>{course.duration}</td>
												<td>{course.rating}</td>
											</tr>
										})
									}
								</tbody>
							</table>
						</>
					}
				</div>
			</div>
		</>
	)
}
