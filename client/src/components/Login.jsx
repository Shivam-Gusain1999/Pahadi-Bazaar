import React from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
const Login = () => {
    const { setShowUserLogin, setUser, axios, navigate } = useAppContext()
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandler = async (event) => {

        try {
            event.preventDefault();
            const { data } = await axios.post(`/api/user/${state}`, {
                name, email, password
            })
            if (data.success) {
                navigate('/')
                setUser(data.user)
                setShowUserLogin(false)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }






    }

    return (<div onClick={() => { setShowUserLogin(false) }} className="text-gray-950 dark:text-white fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center bg-black/30 backdrop-blur-sm">
        <form onSubmit={onSubmitHandler} onClick={(e) => { e.stopPropagation() }} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-950 dark:text-white rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors">
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p className="text-sm font-medium mb-1">Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 dark:border-gray-600 rounded w-full p-2 mt-1 outline-primary bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" type="text" required />
                </div>
            )}
            <div className="w-full ">
                <p className="text-sm font-medium mb-1">Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 dark:border-gray-600 rounded w-full p-2 mt-1 outline-primary bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" type="email" required />
            </div>
            <div className="w-full ">
                <p className="text-sm font-medium mb-1">Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 dark:border-gray-600 rounded w-full p-2 mt-1 outline-primary bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" type="password" required />
            </div>
            {state === "register" ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Already have account? <span onClick={() => setState("login")} className="text-primary hover:underline cursor-pointer font-medium">click here</span>
                </p>
            ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Create an account? <span onClick={() => setState("register")} className="text-primary hover:underline cursor-pointer font-medium">click here</span>
                </p>
            )}
            <button
                className={`w-full py-2.5 rounded-md cursor-pointer text-white font-medium transition-all shadow-md hover:shadow-lg ${state === "register" ? "bg-green-500 hover:bg-green-600" : "bg-primary hover:bg-primary-dull"
                    }`}
            >
                {state === "register" ? "Create Account" : "Login"}
            </button>

        </form>
    </div>

    );
};
export default Login;