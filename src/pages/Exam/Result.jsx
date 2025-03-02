import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Result = () => {
    return (
        <div className="h-full bg-[#1E0771] py-20 px-16">
            <div className="h-full bg-white p-12 rounded-xl">
                <h1 className="text-3xl font-bold text-[#1E0771] ">Hasil akhir ujian</h1>
                <div className="border-2 mt-8 p-6 rounded-xl border-secondary">
                    <h2 className="text-xl font-bold">
                        Ujian divisi
                    </h2>

                    {/* Result */}
                    <div className="flex flex-col justify-between px-4 gap-8 mt-8">

                        {/* Benar */}
                        <div className="flex flex-row text-[#2E1461] text-2xl items-center justify-between">
                            <div className="flex flex-row items-center gap-6">
                                <FaCheckCircle className="text-5xl" />
                                <h2 className="font-semibold">
                                    Benar:
                                </h2>
                            </div>
                            <h2 className="text-xl font-bold text-[#2E1461]">
                                17
                            </h2>
                        </div>


                        {/* Salah */}
                        <div className="flex flex-row text-[#2E1461] text-2xl items-center justify-between">
                            <div className="flex flex-row items-center gap-6">
                                <FaTimesCircle className="text-5xl" />
                                <h2 className="font-semibold">
                                    Salah:
                                </h2>
                            </div>
                            <h2 className="text-xl font-bold text-[#2E1461]">
                                0
                            </h2>
                        </div>

                        {/* Nilai */}
                        <div className="flex flex-row text-[#2E1461] text-2xl items-center justify-between">
                            <div className="flex flex-row items-center gap-6">
                                <FaTimesCircle className="text-5xl opacity-0" />
                                <h2 className="font-semibold">
                                    Nilai:
                                </h2>
                            </div>
                            <h2 className="text-xl font-bold text-[#2E1461]">
                                100
                            </h2>
                        </div>

                    </div>
                </div>
                <div className="w-full flex flex-col mt-12">
                    <Link to="/dashboard">
                        <button className="border-2 lg:w-1/4 w-full self-end py-4 rounded-lg bg-secondary text-white font-semibold hover:cursor-pointer hover:bg-white hover:text-[#2E1461]">

                            Kembali ke Dashboard

                        </button>
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default Result;