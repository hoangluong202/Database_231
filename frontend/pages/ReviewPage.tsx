import { useEffect } from 'react';
import { invokeQuery } from '@fe/services';

export function ReviewPage() {
    useEffect(() => {
        const handleInvoke = async () => {
            const a = await invokeQuery('select * from "Course"');
            console.log(a);
        };
        handleInvoke();
    }, []);

    return <></>;
}
