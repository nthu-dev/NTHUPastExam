"use client"
import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import {CloudArrowDownIcon, ExclamationCircleIcon} from "@heroicons/react/24/outline";
import Link from "next/link";
import Swal from "sweetalert2";
import {ExclamationTriangleIcon} from "@heroicons/react/20/solid";

const people = [
    {name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member'},
    // More people...
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Example({params: {course_year, course, teacher}}) {
    const [quiz, setQuiz] = useState([])
    const pathname = usePathname()

    const qs = new URLSearchParams({
        course: decodeURIComponent(course),
        teacher: decodeURIComponent(teacher),
        course_year
    });

    const download = async (id) => {
        try {
            const data = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/' + id + '/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(r => {
                if (!r.ok) throw new Error(r.statusText)
                return r.json()
            })
            window.open(process.env.NEXT_PUBLIC_API_ENDPOINT + '/download?token=' + data.token + `&at=${localStorage.getItem('token')}`, '_blank')
        } catch (e) {
            console.log(e)
        }
    }

    const report = async (id) => {
        const result = await Swal.fire({
            title: '舉報的相關資訊',
            input: 'text',
            inputLabel: '舉報原因',
            inputPlaceholder: '請輸入舉報原因',
            showCancelButton: true,
            confirmButtonText: '舉報',
            cancelButtonText: '取消',
        })
        if (result.isConfirmed) {
            try {
                const data = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/quiz/' + id + '/report', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        reason: result.value
                    })
                }).then(r => {
                    if(!r.ok) {
                        return r.text().then(text => { throw new Error(text) })
                    }
                    return r
                })
                Swal.fire({
                    title: '舉報成功',
                    icon: 'success',
                    text: '我們已經收到您的舉報，我們會盡快處理並核實',
                })
            } catch (e) {
                console.log(e.message)
                if (JSON.parse(e.message)?.error) {
                    Swal.fire({
                        title: '舉報失敗',
                        icon: 'error',
                        text: JSON.parse(e.message)?.error,
                    })
                }
            }
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const data = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/quiz?' + qs.toString(), {
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
        <div className="mt-16 px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">考古題</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        {teacher}'s {decodeURIComponent(course)} 考古題列表
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Link
                        href={`/quiz/new`}
                        type="button"
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        新建考古題
                    </Link>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead>
                            <tr>
                                <th
                                    scope="col"
                                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                >
                                    科目
                                </th>
                                <th
                                    scope="col"
                                    className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                                >
                                    年份
                                </th>
                                <th
                                    scope="col"
                                    className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                                >
                                    類型
                                </th>
                                <th
                                    scope="col"
                                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                                >
                                    檔案
                                </th>
                                <th
                                    scope="col"
                                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                                >
                                    標籤
                                </th>
                                <th
                                    scope="col"
                                    className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-center text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                                >
                                    操作
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {quiz.length > 0 && quiz.map((q, qIdx) => (
                                <tr key={q.id}>
                                    <td
                                        className={classNames(
                                            qIdx !== people.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8 flex items-center'
                                        )}
                                    >
                                        { q.report_cnt >= 1 && <span className="text-red-500 inline-flex"><ExclamationTriangleIcon className={"h-5 w-5"}/></span> }
                                        {q.course}
                                    </td>
                                    <td
                                        className={classNames(
                                            qIdx !== people.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell'
                                        )}
                                    >
                                        {q.year}
                                    </td>
                                    <td
                                        className={classNames(
                                            qIdx !== people.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'
                                        )}
                                    >
                                        {q.type}
                                    </td>
                                    <td
                                        className={classNames(
                                            qIdx !== people.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                                        )}
                                    >
                                        {q.filename}
                                    </td>
                                    <td
                                        className={classNames(
                                            qIdx !== people.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                                        )}
                                    >
                                        {q.tags.length > 0 && q.tags.map(tag => (
                                            <span className={"bg-gray-400 text-white p-2 rounded-xl"}>{tag}</span>
                                        ))}
                                        {q.tags.length === 0 && (
                                            <span>目前沒有標籤</span>
                                        )}
                                    </td>
                                    <td
                                        className={classNames(
                                            qIdx !== people.length - 1 ? 'border-b border-gray-200' : '',
                                            'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8'
                                        )}
                                    >
                                        <button onClick={e => download(q.id)}
                                                className="text-white border p-2 rounded-xl shadow-md bg-indigo-600 hover:bg-indigo-700 inline-flex gap-1">
                                            <CloudArrowDownIcon className={"h-5 w-5"}/> 下載
                                        </button>
                                        <button onClick={e => report(q.id)}
                                                className="ml-1 text-white border p-2 rounded-xl shadow-md bg-red-600 hover:bg-red-700 inline-flex gap-1">
                                            <ExclamationCircleIcon className={"h-5 w-5"}/> 舉報
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {quiz.length === 0 && (
                                <tr>
                                    <td
                                        className={classNames(
                                            'border-b border-gray-200',
                                            'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                        )}
                                    >
                                        無資料
                                    </td>
                                    <td
                                        className={classNames(
                                            'border-b border-gray-200',
                                            'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell'
                                        )}
                                    >
                                        無資料
                                    </td>
                                    <td
                                        className={classNames(
                                            'border-b border-gray-200',
                                            'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'
                                        )}
                                    >
                                        無資料
                                    </td>
                                    <td
                                        className={classNames(
                                            'border-b border-gray-200',
                                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                                        )}
                                    >
                                        無資料
                                    </td>
                                    <td
                                        className={classNames(
                                            'border-b border-gray-200',
                                            'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8'
                                        )}
                                    >
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
