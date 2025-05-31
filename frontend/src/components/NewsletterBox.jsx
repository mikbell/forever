import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from './Button'; // Importa il tuo componente Button riutilizzabile
// Assicurati che il percorso sia corretto. Se Button.jsx è in una cartella 'components',
// potrebbe essere import Button from '../components/Button';

const NewsletterBox = ({
    title = "Subscribe now and get 20% off",
    description = "Be the first to know about our new arrivals, exclusive offers, and get a special discount on your next purchase.",
    placeholderText = "Enter your email address",
    buttonText = "Subscribe",
    onSubmitForm,
    className = "",
}) => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        if (submitMessage) setSubmitMessage('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!email) {
            setSubmitMessage('Please enter a valid email address.');
            return;
        }
        if (onSubmitForm) {
            setIsSubmitting(true);
            setSubmitMessage('');
            try {
                await onSubmitForm(email);
                setSubmitMessage('Thanks for subscribing!');
                setEmail('');
            } catch (error) {
                setSubmitMessage(error.message || 'Something went wrong. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            console.log("Newsletter form submitted with email:", email);
            setSubmitMessage('Subscription simulated (no actual submission).');
            setEmail('');
        }
    };

    return (
        <section className={`text-center py-12 sm:py-16 px-4 ${className}`} aria-labelledby="newsletter-title">
            <h2
                id="newsletter-title"
                className='text-2xl sm:text-3xl font-semibold text-gray-800 mb-2 sm:mb-3'
            >
                {title}
            </h2>
            <p className="max-w-lg mx-auto text-sm text-gray-500 leading-relaxed mb-6 sm:mb-8">
                {description}
            </p>
            <form
                onSubmit={handleSubmit}
                noValidate
                className='w-full max-w-md mx-auto'
            >
                <div className="flex items-center gap-0 rounded-md shadow-sm border border-gray-300 
                                focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 
                                overflow-hidden transition-all">
                    <label htmlFor="newsletter-email-input" className="sr-only">
                        {placeholderText}
                    </label>
                    <input
                        id="newsletter-email-input"
                        className='flex-1 py-3 px-4 text-sm text-gray-700 outline-none border-none placeholder-gray-400 bg-white min-w-0'
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder={placeholderText}
                        required
                        disabled={isSubmitting}
                        aria-describedby="submit-message"
                    />
                    {/* Utilizzo del componente Button riutilizzabile */}
                    <Button
                        type='submit'
                        variant='primary'
                        size='md'
                        disabled={isSubmitting}
                        className="!rounded-none !py-3 px-5 sm:!px-6 
                                   focus-visible:!ring-gray-800 focus-visible:!ring-offset-1 focus-visible:!bg-gray-700"
                    >
                        {isSubmitting ? 'Subscribing...' : buttonText}
                    </Button>
                </div>
                {submitMessage && (
                    <p id="submit-message" role="alert" className={`mt-3 text-xs ${submitMessage.includes('Thanks') || submitMessage.includes('simulated') ? 'text-green-600' : 'text-red-600'}`}>
                        {submitMessage}
                    </p>
                )}
            </form>
        </section>
    );
};

NewsletterBox.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    placeholderText: PropTypes.string,
    buttonText: PropTypes.string,
    onSubmitForm: PropTypes.func,
    className: PropTypes.string,
};

export default NewsletterBox;