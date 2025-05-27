import React from "react"
import style from "./jobList.module.css"
import CardJob from "../CardJob/CardJob"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import JobFilter from "../jobFilter/JobFilter"
import toast, { Toaster } from "react-hot-toast"
import { API_URL } from "../../../utils/constants"

export default function JobList() {
	const [jobs, setJobs] = useState([])

	const [filters, setFilters] = useState({
		category: "",
		location: "",
		tags: "",
	})

	const [categories, setCategories] = useState([])

	const [location, setLocation] = useState([])

	const [filteredJobs, setFilteredJobs] = useState([])

	const [countJob, setCountJob] = useState(0)

	const [page, setPage] = useState(0)

	const maxNumPage = countJob / 9

	function handlePage(newPage) {
		if (newPage < 0) {
			return
		}
		if (newPage >= maxNumPage) {
			return
		}
		setPage(newPage)
	}

	const queryInput = useSelector((state) => state.search.queryInput)

	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetch(`${API_URL}/jobs/categories`)
			.then((response) => {
				return response.json()
			})
			.then((data) => {
				setCategories(data)
			})
	}, [])

	useEffect(() => {
		fetch(`${API_URL}/jobs/locations`)
			.then((response) => {
				return response.json()
			})

			.then((data) => {
				setLocation(data)
				console.log(data)
			})
	}, [])

	useEffect(() => {
		setPage(0)
	}, [queryInput, filters])

	useEffect(() => {
		setLoading(true)
		fetch(
			`${API_URL}/jobs?title=${queryInput}&offset=${page * 9}&category=${
				filters.category
			}&location=${filters.location}`
		)
			.then((response) => response.json())
			.then((data) => {
				setJobs(data.rows)
				setCountJob(data.count)
				setFilteredJobs(filteredJobs)
			})
			.catch((error) => console.log("Error al obtener los trabajos", error))
			.finally(() => setLoading(false))
	}, [queryInput, page, filters])

	const handleFilterChange = (filters) => {
		const filteredJobs = jobs.filter((job) => {
			const matchesCategory =
				filters.category === "" || job.category === filters.category

			const matchesLocation =
				filters.location === "" ||
				filters.location === job.candidate_required_location

			return matchesCategory && matchesLocation
		})

		setFilteredJobs(filteredJobs)
	}

	const handleDelete = async (jobId) => {
		try {
			const response = await fetch(`${API_URL}/jobs/${jobId}`, {
				method: "DELETE",
			})

			if (!response.ok) {
				throw new Error("Error al eliminar")
			}

			setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId))
			toast.success("¡Trabajo eliminado!")
		} catch (error) {
			console.error(error)
			toast.error("Error al eliminar el trabajo")
		}
	}

	return (
		<div className={style.container}>
			<JobFilter
				onFilterChange={handleFilterChange}
				categories={categories}
				filters={filters}
				setFilters={setFilters}
				location={location}
			/>
			{!loading ? (
				<div className={style.containerCards}>
					{jobs.map((job) => (
						<CardJob key={job.id} job={job} onDelete={handleDelete} />
					))}
				</div>
			) : (
				<div className={style.containerLoading}>
					<p>Loading jobs...</p>
				</div>
			)}

			<div className={style.containerPages}>
				<button onClick={() => handlePage(page - 1)}>Prev</button>
				<p>
					Showing {page * 9}-{page * 9 + jobs.length} of {countJob}
				</p>
				<button onClick={() => handlePage(page + 1)}>Next</button>
			</div>
		</div>
	)
}
