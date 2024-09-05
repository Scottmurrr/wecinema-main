import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Delete, Layout, Render } from "../components";
import { getRequest, putRequest } from "../api";
import { decodeToken,  } from "../utilities/helperfFunction";
import '../components/header/drowpdown.css';
import { FaEdit } from 'react-icons/fa';
import axios from 'axios';

let token = localStorage.getItem("token") || null;

const GenrePage: React.FC = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>({});
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ username: "", dob: "" });
    const [userHasPaid, setUserHasPaid] = useState(false);
    const [currentUserHasPaid, setCurrentUserHasPaid] = useState(false);
    const [scripts] = useState([]);
	const [data] = useState<any>([]);
	const [showMoreIndex, setShowMoreIndex] = useState<number | null>(null);
	const nav = useNavigate();

    useEffect(() => {
        if (!id) {
            toast.error("Please login first");
            return;
        }

        const fetchData = async () => {
            try {
                const result: any = await getRequest("/user/" + id, setLoading);
                setUser(result);
                const response = await axios.get(`https://wecinema-main.vercel.app/user/payment-status/${id}`);
                setUserHasPaid(response.data.hasPaid);
                const tokenData = decodeToken(token);
                if (tokenData) {
                    const currentUserResponse = await axios.get(`https://wecinema-main.vercel.app/user/payment-status/${tokenData.userId}`);
                    setCurrentUserHasPaid(currentUserResponse.data.hasPaid);
                }
                setFormData({ username: result.username, dob: result.dob });
			   setLoading(true);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (userHasPaid && !currentUserHasPaid) {
            // Logic for userHasPaid and currentUserHasPaid
        }
    }, [userHasPaid, currentUserHasPaid]);

    const renderAllowedGenres = () => {
        if (!user.allowedGenres) return null;

        return user.allowedGenres.map((genre: string) => {
            let bgColor, marginLeft;
            switch (genre) {
                case "G":
                    bgColor = "bg-green-500";
                    marginLeft = "ml-12";
                    break;
                case "PG":
                case "PG-13":
                    bgColor = "bg-blue-500";
                    marginLeft = "ml-4";
                    break;
                case "R":
                    bgColor = "bg-yellow-500";
                    marginLeft = "ml-4";
                    break;
                case "X":
                    bgColor = "bg-red-500";
                    marginLeft = "ml-12";
                    break;
                default:
                    bgColor = "bg-gray-500";
                    marginLeft = "ml-4";
            }
            return (
                <button key={genre} className={`mb-1 ${marginLeft} text-sm sm:text-xl ${bgColor} text-white py-2 px-4 rounded`}>
                    {genre}
                </button>
            );
        });
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await putRequest("/user/edit/" + id, formData, setLoading);
            setUser(result);
            setEditMode(false);
            window.location.reload();
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
    }

    const handleScriptMouseEnter = (index: number) => {
		setShowMoreIndex(index);
	};

	const handleScriptMouseLeave = () => {
		setShowMoreIndex(null);
	};

    return (
        <Layout expand={false} hasHeader={false}>
            <div className="mt-12 px-4 sm:px-6 lg:px-8">
                <div className="flex bg-grey justify-center w-full items-start my-0 mx-auto h-52 sm:h-80">
                <img
                  className="w-full h-full object-cover"
                    src="../assets/cover.jpg"
                    alt="Cover"
                />

                </div>
                <div className="flex flex-col sm:flex-row items-center mt-4">
                    <div className="w-full sm:w-auto sm:mr-4">
                        <img
                            className="rounded-full bg-white h-16 w-16 sm:h-36 sm:w-36 border-2 p-1 border-white"
                            src="../assets/avator.jpg"
                            alt="Avatar"
                        />
                    </div>
                    <div className="flex flex-wrap justify-center sm:justify-start items-center mt-4 sm:mt-0">
                        <button className="mb-1 ml-4 text-sm sm:text-xl bg-white-500 text-black py-2 px-4 rounded border-2 border-gray-700">
                            {user?.followers?.length} Followers
                        </button>
                        <button className="mb-1 ml-4 text-sm sm:text-xl bg-white-500 text-black py-2 px-4 rounded border-2 border-gray-700">
                            {user?.followers?.length} Videos
                        </button>
                        <button className="mb-1 ml-4 text-sm sm:text-xl bg-white-500 text-black py-2 px-4 rounded border-2 border-gray-700">
                            {scripts.length} Scripts
                        </button>
                        <button className="mb-1 ml-4 text-sm sm:text-xl bg-white-500 text-black py-2 px-4 rounded border-2 border-gray-700">
                            {user?.followers?.length} Likes
                        </button>
                        <button className="mb-1 ml-4 text-sm sm:text-xl bg-white-500 text-black py-2 px-4 rounded border-2 border-gray-700">
                            {user?.bookmarks?.length} Bookmarks
                        </button>
                        {userHasPaid && (
                            <a href="/hypemodeprofile">
                                <button className="mb-1 ml-4 text-sm sm:text-xl bg-yellow-500 text-white py-2 px-4 rounded border-2 border-gray-700">
                                    Hypemode
                                </button>
                            </a>
                        )}
                    </div>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row">
                    <div className="w-full sm:w-1/2">
                        <div className="flex flex-col px-4">
                            {editMode ? (
                                <form onSubmit={handleSubmit} className="flex flex-col">
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="mb-2 p-2 border rounded"
                                    />
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        className="mb-2 p-2 border rounded"
                                    />
                                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded mb-2">
                                        Save
                                    </button>
                                </form>
                            ) : (
                                <>
                                    <div className="overflow-hidden text-ellipsis font-extrabold text-base sm:text-2xl mb-2">
                                        {user.username}
                                    </div>
                                    <div className="overflow-hidden text-ellipsis font-normal text-base mb-2">
                                        {user.email}
                                    </div>
                                    <div className="overflow-hidden text-ellipsis font-normal text-base mb-2">
                                        Date of Birth: {user.dob}
                                    </div>
                                    <button onClick={handleEdit}>
                                        <FaEdit size="20" />
                                    </button>
                                </>
                            )}
                            <hr className="border-t border-gray-300 w-full my-2" />
                            <div>
                                <h1 className="text-lg sm:text-xl font-bold mb-2">Allowed Ratings</h1>
                                {renderAllowedGenres()}
                            </div>
                        </div>
                    </div>
                    <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
                        <Delete category="" length={3} data={id} />
                        <div className="mt-4">
                            {!loading && (
                                <h2 className="text-lg sm:text-xl font-extrabold">Scripts</h2>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                                {scripts?.map((script: string, index: number) => (
                                    <div
                                        key={index}
                                        className={`${
                                            showMoreIndex === index
                                                ? "bg-black text-white bg-opacity-50 overflow-y-auto"
                                                : "bg-white text-black overflow-y-hidden"
                                        } overflow-y-hidden hide-scrollbar border w-full max-h-64 text-slate-950 p-4 rounded-sm relative`}
                                        onMouseEnter={() => handleScriptMouseEnter(index)}
                                        onMouseLeave={handleScriptMouseLeave}
                                        onClick={() =>
                                            nav(`/script/${data[index]._id}`, {
                                                state: JSON.stringify(data[index]),
                                            })
                                        }
                                    >
                                        <h2>{data[index].title}</h2>
                                        {showMoreIndex === index && (
                                            <button
                                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-2 py-1 rounded-md"
                                                onClick={() => console.log("Read more clicked")}
                                            >
                                                Read More
                                            </button>
                                        )}
                                        <Render htmlString={script} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default GenrePage;
