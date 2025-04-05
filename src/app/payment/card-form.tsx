import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const cardFormSchema = z.object({
    cardNumber: z.string()
        .min(16, 'Card number must be 16 digits')
        .max(16, 'Card number must be 16 digits')
        .regex(/^[0-9]{16}$/, 'Please enter a valid 16-digit card number'),
    expiryDate: z.string()
        .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Please enter a valid date (MM/YY)')
        .refine((val) => {
            const [month, year] = val.split('/');
            const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
            return expiry > new Date();
        }, 'Card has expired'),
    cvc: z.string()
        .regex(/^[0-9]{3,4}$/, 'Please enter a valid CVC (3-4 digits)'),
    cardholderName: z.string()
        .min(3, 'Name must be at least 3 characters long')
        .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
});

type CardFormData = z.infer<typeof cardFormSchema>;

const CardForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CardFormData>({
        resolver: zodResolver(cardFormSchema),
    });

    const onSubmit = (data: CardFormData) => {
        console.log(data);
        // Handle payment submission
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                    Card number
                </label>
                <input
                    {...register('cardNumber')}
                    type="text"
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                        Expires
                    </label>
                    <input
                        {...register('expiryDate')}
                        type="text"
                        id="expiryDate"
                        placeholder="MM/YY"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate.message}</p>}
                </div>

                <div>
                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                        Security code
                    </label>
                    <input
                        {...register('cvc')}
                        type="text"
                        id="cvc"
                        placeholder="CVC"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.cvc && <p className="text-red-500 text-sm mt-1">{errors.cvc.message}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700">
                    Cardholder name
                </label>
                <input
                    {...register('cardholderName')}
                    type="text"
                    id="cardholderName"
                    placeholder="Cardholder name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName.message}</p>}
            </div>

            <button
                type="submit"
                className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors"
            >
                Pay £30 now
            </button>

            <p className="text-sm text-gray-500 text-center">
                Your transaction is secured with SSL encryption
            </p>
        </form>
    );
};

export default CardForm;