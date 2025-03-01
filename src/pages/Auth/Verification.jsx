import SidebarComponent from "../../Components/SidebarComponent";

const Verification = () => {
    return (
        <div className="flex flex-row ">
            <section className="lg:flex-1 flex-2">
                <SidebarComponent />
            </section>
            <section className="lg:flex-4 flex-3 p-8 pl-20">
                <h1 className="text-5xl font-bold">Verification</h1>
            </section>
        </div>
    )
}

export default Verification;