"use client";
import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import {Disclosure} from "@headlessui/react";
import {BookOpenIcon, ClockIcon, UserCircleIcon} from "@heroicons/react/24/solid";
import {ChevronDownIcon} from "@heroicons/react/24/outline";
import {ChevronRightIcon} from "@heroicons/react/20/solid";
import Link from "next/link";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function DesktopSideBar() {
    const [quiz, setQuiz] = useState([])
    const pathname = usePathname()

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
            {Object.keys(quiz).map((course_year) => (
                <Disclosure defaultOpen={decodeURIComponent(pathname).startsWith(`/quiz/${course_year}`)}>
                    {({open}) => (
                        <>
                            <Disclosure.Button className={classNames(
                                pathname.indexOf(course_year) > -1 ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                                'group flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium w-full'
                            )}>
                                <div className={"inline-flex"}><ClockIcon
                                    className={"h-5 w-5"}/> {courseYear[course_year]}</div>
                                <ChevronRightIcon className={open ? 'rotate-90 transform h-5 w-5' : 'h-5 w-5'}/>
                            </Disclosure.Button>
                            <Disclosure.Panel className="text-gray-500 pl-6">
                                {Object.keys(quiz[course_year]).length > 0 && Object.keys(quiz[course_year]).map((course) => (
                                    <Disclosure
                                        defaultOpen={decodeURIComponent(pathname).startsWith(`/quiz/${course_year}/${course}`)}>
                                        {({open}) => (
                                            <>
                                                <Disclosure.Button className={classNames(
                                                    decodeURIComponent(pathname).indexOf(course) > -1 ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                                                    'group flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium w-full'
                                                )}>
                                                    <div className={"inline-flex"}><BookOpenIcon
                                                        className={"h-5 w-5"}/> {course}</div>
                                                    <ChevronRightIcon
                                                        className={open ? 'rotate-90 transform h-5 w-5' : 'h-5 w-5'}/>
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="text-gray-500 pl-6 my-1">
                                                    {Object.keys(quiz[course_year][course]).length > 0 && Object.keys(quiz[course_year][course]).map((teacher) => (
                                                        <Link className={classNames(
                                                            decodeURIComponent(pathname) === `/quiz/${course_year}/${course}/${teacher}` ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                                                            'group flex items-center rounded-md px-2 py-2 text-sm font-medium w-full'
                                                        )}
                                                              href={`/quiz/${course_year}/${course}/${teacher}`}
                                                              key={`${course_year}/${course}/${teacher}`}>
                                                            <UserCircleIcon className={"h-5 w-5"}/>{teacher}
                                                        </Link>
                                                    ))}
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                ))}
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            ))}
        </>
    )
}