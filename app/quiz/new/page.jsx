"use client"
import {PhotoIcon, UserCircleIcon} from '@heroicons/react/24/solid'
import {useState} from "react";
import {DocumentIcon} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import {useRouter} from "next/navigation";

export default function Example() {
    const router = useRouter()
    const [year, setYear] = useState("2021")
    const [type, setType] = useState("小考")
    const [teacher, setTeacher] = useState("")
    const [course, setCourse] = useState("")
    const [course_year, setCourseYear] = useState("1")
    const [file, setFile] = useState(null)
    const courseYear = {
        "1": "大一",
        "2": "大二",
        "3": "大三",
        "4": "大四",
    }
    const create = async (e) => {
        e.preventDefault()
        const fd = new FormData()
        fd.append('year', year)
        fd.append('type', type)
        fd.append('teacher', teacher)
        fd.append('course', course)
        fd.append('course_year', course_year)
        fd.append('tags[]', "考古")
        fd.append('file', file)

        const data = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/quiz', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: fd
        }).then(r => r.json())
        Swal.fire({
            title: '成功',
            text: '已經成功上傳考古題',
            icon: 'success',
        }).then(() => {
            router.replace('/quiz')
        })
    }

    const changeFileInput = (e) => {
        setFile(e.target.files[0])
    }

    const yearList = {}
    for (let i = 90; i <= 112; i++) {
        yearList[i + 1911] = `${i + 1911} (${i}年)`
    }

    const quizType = [
        "期中考（二次段考）",
        "期末考（二次段考）",
        "一段（三次段考）",
        "二段（三次段考）",
        "三段（三次段考）",
        "小考",
        "作業",
    ]

    return (
        <form className={"px-8 mt-8"}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">提交考古題</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        貢獻你的考古題，讓優良傳統傳承
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            <label htmlFor="course_year"
                                   className="block text-sm font-medium leading-6 text-gray-900">
                                課程年度
                            </label>
                            <div className="mt-2">
                                <select
                                    id="course_year"
                                    name="course_year"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    onChange={(e) => setCourseYear(e.target.value)}
                                    value={course_year}
                                >
                                    {Object.keys(courseYear).map((key) => (
                                        <option key={key} value={key}>{courseYear[key]}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="year" className="block text-sm font-medium leading-6 text-gray-900">
                                考古題年度
                            </label>
                            <div className="mt-2">
                                <select
                                    id="year"
                                    name="year"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    onChange={(e) => setYear(e.target.value)}
                                    value={year}
                                >
                                    {Object.keys(yearList).map((key) => (
                                        <option key={key} value={key}>{yearList[key]}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">
                                考古題類型
                            </label>
                            <div className="mt-2">
                                <select
                                    id="type"
                                    name="type"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    onChange={(e) => setType(e.target.value)}
                                    value={type}
                                >
                                    {quizType.map((key) => (
                                        <option key={key} value={key}>{key}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="course" className="block text-sm font-medium leading-6 text-gray-900">
                                課程名稱
                            </label>
                            <div className="mt-2">
                                <input
                                    id="course"
                                    name="course"
                                    type="text"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="資料結構"
                                    value={course}
                                    onChange={(e) => setCourse(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="teacher" className="block text-sm font-medium leading-6 text-gray-900">
                                老師名稱
                            </label>
                            <div className="mt-2">
                                <input
                                    id="teacher"
                                    name="teacher"
                                    type="text"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="王大明"
                                    value={teacher}
                                    onChange={(e) => setTeacher(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="file" className="block text-sm font-medium leading-6 text-gray-900">
                                考古題檔案
                            </label>
                            <div
                                className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                <div className="text-center">
                                    <DocumentIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true"/>
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                        <label
                                            htmlFor="file"
                                            className="relative cursor-pointer text-center w-full rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                        >
                                            {file ? (
                                                <span>{file.name}</span>
                                            ) : <span>上傳檔案</span>}
                                            <input id="file" name="file" type="file" className="sr-only"
                                                   onChange={changeFileInput} accept={"image/*, application/pdf"}/>
                                        </label>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, PDF 最高 10MB</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="my-6 flex items-center justify-end gap-x-6">
                <button
                    onClick={create}
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    建立
                </button>
            </div>
        </form>
    )
}
