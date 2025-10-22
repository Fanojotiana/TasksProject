import { Head, router } from "@inertiajs/react";
import {Button} from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {Plus, Pencil, Trash2, CheckCircle2, XCircle, Calendar, List, CheckCircle, Search, ChevronLeft, ChevronRight} from 'lucide-react';
import{Link} from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import { title } from "process";

interface Task{
    id: number;
    title:string;
    description: string|null;
    is_completed: boolean;
    due_date: string|null;
    list_id: number;
    list:{
        id:number;
        title: string;
    };
}
interface List{
    id: number;
    title:string;

}
interface Props{
    tasks:{
        data: Task[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    lists: List[];
    filters:{
        search: string;
        filter: string;
    };
    flash?:{
        success?:string;
        error?:string;
    };
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

export default function TasksIndex({
    tasks, lists, filters, flash
}: Props){
    const[isOpen, setIsOpen]= useState(false);
    const[editingTask, setEditingTask] = useState<Task|null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [completionFilter, setCompletionFilter] = useState<'all' | 'completed' | 'pending'>(filters.filter as 'all' | 'completed' | 'pending');

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType('success');
            setShowToast(true);
        } else if (flash?.error) {
            setToastMessage(flash.error);
            setToastType('error');
            setShowToast(true);
        }
    }, [flash]);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const {data, setData, post, put, reset, processing, delete: destroy} = useForm({
        title: '',
        description: '',
        due_date: '',
        list_id: '',
        is_completed: false as boolean,
    });
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingTask){
            put(route('tasks.update', editingTask.id),{
                onSuccess:() => {
                    setIsOpen(false);
                    reset();
                    setEditingTask(null);
                },
            });
        }else{
            post(route('tasks.store'),{
                onSuccess:()=>{
                    setIsOpen(false);
                    reset();
                },
        });
}
};
const handleEdit = (task: Task) => {
    setEditingTask(task);
    setData({
        title: task.title,
        description: task.description || '',
        list_id: task.list_id.toString(),
        is_completed: task.is_completed,
    });
    setIsOpen(true);
};
const handleDelete = (taskId: number) => {
    destroy(route('tasks.destroy', taskId));
};

const handleSearch =(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.get(route('tasks.index'),{
        search: seacrhItem,
        filter: completionFilter,
    },{
        preserveState: true,
        preserveScroll: true,
    });
};
const handleFilterChange =(value: 'all' | 'completed' | 'pending') =>{
    setCompletionFilter(value:'all' | 'completed' | 'pending') =>{
        setCompletionFilter(value);
    router.get(route('tasks.index'),{
        search: searchTerm,
        filter: value,
    },{
        preserveState: true,
        preserveScroll: true,
    });
};
const handlePageChange = (page: number) => {
    router.get(route('tasks.index'),{
        search: searchTerm,
        filter: completionFilter,
        page: page,
    },{
        preserveState: true,
        preserveScroll: true,
    });
};
return(
    <AppLayout
      
        breadcrumbs={breadcrumbs}
    >
        <Head title="Tasks" />
        <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold">Tasks</h1>
            <Button onClick={() => setIsOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Task
            </Button>
        </div>
        {/* Rest of the component JSX goes here */}
    </AppLayout>
);
}
