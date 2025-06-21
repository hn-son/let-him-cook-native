export const formatDate = (dateString: string) => {
    try {
        const date = new Date(Number(dateString));

        if (isNaN(date.getTime())) {
            return 'Vừa xong';
        }

        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Vừa xong';
    }
};
