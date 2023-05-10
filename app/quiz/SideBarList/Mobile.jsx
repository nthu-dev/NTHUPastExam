"use client"
import {Bars4Icon, ClockIcon, HomeIcon} from "@heroicons/react/24/outline";
import {useEffect, useState} from "react";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
export default function MobileSideBar() {
    const [quiz, setQuiz] = useState([])
    useEffect(() => {
        (async () => {
            try {
                const data = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/quiz', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }).then(r => r.json())

                const new_data = {}
                // course_year has many courses, and course has many teachers make a level object `new_data`
                data.forEach((q) => {
                    if (!new_data[q.course_year]) new_data[q.course_year] = {}
                    if (!new_data[q.course_year][q.course]) new_data[q.course_year][q.course] = {}
                    if (!new_data[q.course_year][q.course][q.teacher]) new_data[q.course_year][q.course][q.teacher] = []
                    new_data[q.course_year][q.course][q.teacher].push(q)
                })
                setQuiz(new_data)
            } catch (e) {
                console.log(e)
            }
        })()
    }, [pathname])
    const courseYear = {
        "1": "大一",
        "2": "大二",
        "3": "大三"
    }
    return (
        <>
            {Object.keys(quiz).map((item) => (
                <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                        item.current
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                        'group flex items-center rounded-md px-2 py-2 text-base font-medium leading-5'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                >
                    <item.icon
                        className={classNames(
                            item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                            'mr-3 h-6 w-6 flex-shrink-0'
                        )}
                        aria-hidden="true"
                    />
                    {item.name}
                </a>
            ))}
        </>
    )
}