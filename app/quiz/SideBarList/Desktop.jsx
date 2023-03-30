"use client";
import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import {Disclosure} from "@headlessui/react";
import {BookOpenIcon, ClockIcon, UserCircleIcon} from "@heroicons/react/24/solid";
import {ChevronDownIcon} from "@heroicons/react/24/outline";
import {ChevronRightIcon} from "@heroicons/react/20/solid";

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
                setQuiz(data)
            } catch (e) {
                console.log(e)
            }
        })()
    }, [pathname])

    const courseYear = {
        "大一": "1",
        "大二": "2",
        "大三": "3"
    }

    return (
        <>
            {Object.keys(courseYear).map((year) => (
                <Disclosure defaultOpen={decodeURIComponent(pathname).startsWith(`/quiz/${courseYear[year]}`)}>
                    {({open}) => (
                        <>
                            <Disclosure.Button className={classNames(
                                pathname.indexOf(year) > -1 ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                                'group flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium w-full'
                            )}>
                                <div className={"inline-flex"}><ClockIcon className={"h-5 w-5"}/> {year}</div>
                                <ChevronRightIcon className={open ? 'rotate-90 transform h-5 w-5' : 'h-5 w-5'}/>
                            </Disclosure.Button>
                            <Disclosure.Panel className="text-gray-500 pl-6">
                                {quiz.length && quiz.filter(r => r.course_year === courseYear[year]).map((q) => (
                                    <Disclosure
                                        defaultOpen={decodeURIComponent(pathname).startsWith(`/quiz/${q.course_year}/${q.course}`)}>
                                        {({open}) => (
                                            <>
                                                <Disclosure.Button className={classNames(
                                                    pathname.indexOf(year) > -1 ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                                                    'group flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium w-full'
                                                )}>
                                                    <div className={"inline-flex"}><BookOpenIcon
                                                        className={"h-5 w-5"}/> {q.course}</div>
                                                    <ChevronRightIcon
                                                        className={open ? 'rotate-90 transform h-5 w-5' : 'h-5 w-5'}/>
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="text-gray-500 pl-6">
                                                    {quiz.length && quiz.filter(r => r.course_year === courseYear[year]).filter(r => r.course === q.course).map((c) => (
                                                        <a className={classNames(
                                                            decodeURIComponent(pathname) === `/quiz/${q.course_year}/${q.course}/${c.teacher}` ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                                                            'group flex items-center rounded-md px-2 py-2 text-sm font-medium w-full'
                                                        )}
                                                           href={`/quiz/${q.course_year}/${q.course}/${c.teacher}`}><UserCircleIcon
                                                            className={"h-5 w-5"}/>{c.teacher}</a>
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