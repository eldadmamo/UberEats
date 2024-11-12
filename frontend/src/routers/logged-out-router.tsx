import { useState } from "react"
import { isLoggedInVar } from "../apollo"
import { useForm } from "react-hook-form"


export const LoggedOutRouter = () => {
    const {register,watch, handleSubmit, formState: { errors }} = useForm();
    const onSubmit = () => {
        console.log(watch())
    }
    const IsValid = () => {
        console.log("can not create account");
    }
    console.log(errors)
    return (
        <div>
            <h1>Logged Out</h1>
            <form onSubmit={handleSubmit(onSubmit, IsValid)}>
                <div>
                    <input {...register("email", { required: true, validate: (email:string) => email.includes("@gmail.com")})}  type="email" required placeholder="email" />
                </div>
                <div>
                    <input {...register("password",{required:true})}  type="password" required placeholder="password" />
                </div>
                <button className="bg-yellow-300 text-white">Submit</button>
            </form>
        </div>
    )
}