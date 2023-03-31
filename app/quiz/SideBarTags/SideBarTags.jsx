"use client"

import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";
import _ from "lodash";

const teams = [
    {name: 'Engineering', href: '#', bgColorClass: 'bg-indigo-500'},
    {name: 'Human Resources', href: '#', bgColorClass: 'bg-green-500'},
    {name: 'Customer Success', href: '#', bgColorClass: 'bg-yellow-500'},
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function SideBarTags() {
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
    return (
        <>
            <h3 className="px-3 text-sm font-medium text-gray-500" id="desktop-teams-headline">
                Tags
            </h3>
            <div className="mt-1 space-y-1" role="group" aria-labelledby="desktop-teams-headline">
                {_.uniq(quiz.reduce((acc, curr) => (
                    [...acc, ...curr.tags]
                ), [])).map((tag) => (
                    <Link
                        key={tag}
                        href={`/quiz/tag/${tag}`}
                        className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <span
                          className={classNames('mr-4 h-2.5 w-2.5 rounded-full')}
                          aria-hidden="true"
                      />
                        <span className="truncate">{tag}</span>
                    </Link>
                ))}
            </div>
        </>
    )
}