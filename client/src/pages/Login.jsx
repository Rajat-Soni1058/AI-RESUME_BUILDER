import React from 'react'
import { User2Icon, Lock, Mail } from "lucide-react";
import IIIT1 from "../assets/IIIT1.jpeg";
import IIIT2 from "../assets/IIIT2.jpeg";
import IIIT3 from "../assets/IIIT3.jpeg";
import IIIT4 from "../assets/IIIT4.jpeg";
import IIIT5 from "../assets/IIIT5.jpeg";
import { useDispatch } from 'react-redux';
import { login } from '../app/feature/authSlice.js';
import toast from 'react-hot-toast';
import api from '../configs/api.js';

const Login = () => {
  const dispatch = useDispatch();

    const query = new URLSearchParams(window.location.search);
const urlState = query.get("state");

  const [state, setState] = React.useState(urlState||"login")

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {e.preventDefault()
  try {
    const { data } = await api.post(`/api/users/${state}`, formData)
    dispatch(login(data))
    localStorage.setItem('token', data.token)
    toast.success("signup successfully ");
  } catch (error) {
    console.error(error);

    toast.error(
      typeof error?.response?.data?.message === "string"
        ? error.response.data.message
        : "Signup failed"
    );
  }
}

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  


  React.useEffect(() => {
  const slider = document.getElementById("slider");
  if (!slider) return;

  let currentSlide = 0;
  const totalSlides = slider.children.length;

  const interval = setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    slider.style.transform = `translateX(-${currentSlide * slider.clientWidth}px)`;
  }, 3000);

  return () => clearInterval(interval);
}, []);


  return (

    <div className="flex h-[700px] w-full bg-gray-50">

  <div className="hidden md:inline-block ml-30 mt-17 w-200 h-150 rounded-2x1 overflow-hidden">


  <div className="hidden md:flex w-full h-full rounded-2xl overflow-hidden">
    <div className="w-full h-full overflow-hidden relative">
      <div
        id="slider"
        className="flex h-full transition-transform duration-500 ease-in-out"
      >
        <img
          src={IIIT1}
          className="w-full h-full object-cover flex-shrink-0"
          alt="Slide 1"
        />
        <img
          src={IIIT2}
          className="w-full h-full object-cover flex-shrink-0"
          alt="Slide 2"
        />
        <img
          src={IIIT3}
          className="w-full h-full object-cover flex-shrink-0"
          alt="Slide 3"
        />
        <img
          src={IIIT4}
          className="w-full h-full object-cover flex-shrink-0"
          alt="Slide 4"
        />
        <img
          src={IIIT5}
          className="w-full h-full object-cover flex-shrink-0"
          alt="Slide 5"
        />
      </div>
    </div>
  </div>
</div>


      <div className="w-full flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="sm:w-87.5 w-full text-center bg-white border border-gray-200 rounded-2xl px-8 shadow-md"
        >
          <h1 className="text-gray-900 text-3xl mt-10 font-medium">
            {state === "login" ? "Login" : "Sign up"}
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            Please {state} to continue
          </p>

          {state !== "login" && (
            <div className="flex items-center mt-6 w-full bg-white border border-gray-300 h-12 rounded-full overflow-hidden pl-6 gap-2">
              <User2Icon size={16} color="#6B7280" />
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full bg-transparent text-gray-900 placeholder-gray-400
           outline-none border-none ring-0 focus:ring-0 focus:outline-none focus:border-none"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="flex items-center w-full mt-4 bg-white border border-gray-300 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <Mail size={13} color="#6B7280" />
            <input
              type="email"
              name="email"
              placeholder="Email id"
              className="w-full bg-transparent text-gray-900 placeholder-gray-400
           outline-none border-none ring-0 focus:ring-0 focus:outline-none focus:border-none"

              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center mt-4 w-full bg-white h-12 rounded-full 
                border border-gray-300 
                px-6 gap-2
                focus-within:border-gray-400">
            <Lock size={13} color="#6B7280" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full bg-transparent text-gray-900 placeholder-gray-400
           outline-none border-none ring-0 focus:ring-0 focus:outline-none focus:border-none"

              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mt-4 text-left">
            <button
              type="button"
              className="text-sm text-green-500 hover:underline"
            >
              Forget password?
            </button>
          </div>

          <button
            type="submit"
            className="mt-2 w-full h-11 rounded-full text-white bg-green-600 hover:bg-green-500 transition"
          >
            {state === "login" ? "Login" : "Sign up"}
          </button>

          <p
            onClick={() =>
              setState(prev => prev === "login" ? "register" : "login")
            }
            className="text-gray-500 text-sm mt-3 mb-11 cursor-pointer"
          >
            {state === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <span className="text-green-500 hover:underline ml-1">
              click here
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login;
