import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProfileComponent = () => {
    return (
        <Link to="/profile">
            <button className="self-end flex flex-row gap-2 md:gap-4 items-center hover:bg-gray-100  hover:cursor-pointer
 hover:cursor-pointer pl-2">
                <h2 className="text-[#2E1461] text-lg md:text-2xl font-bold">Berka Aldizar</h2>
                <div className="border p-3 md:p-6 bg-[#372088]">
                    <FaUser className="text-white text-xl md:text-2xl" />
                </div>
            </button>
        </Link>
    )
}

export default ProfileComponent;