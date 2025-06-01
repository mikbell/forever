import React, { useState } from 'react';
import Title from '../components/Title';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import { Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Il nome è obbligatorio.';
      isValid = false;
    }
    if (!formData.email.trim()) {
      errors.email = 'L\'email è obbligatoria.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Inserisci un\'email valida.';
      isValid = false;
    }
    if (!formData.subject.trim()) {
      errors.subject = 'L\'oggetto è obbligatorio.';
      isValid = false;
    }
    if (!formData.message.trim()) {
      errors.message = 'Il messaggio è obbligatorio.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      console.log('Dati del form di contatto:', formData);
      // Simulate API call
      try {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        toast.success('Messaggio inviato con successo! Ti risponderemo presto.');
        setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
        setFormErrors({}); // Clear errors
      } catch (error) {
        console.error('Errore durante l\'invio del messaggio:', error);
        toast.error('Si è verificato un errore. Riprova più tardi.');
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      {/* Sezione Introduttiva / Hero */}
      <section className="text-center mb-12 md:mb-16">
        <Title
          text1="Contattaci"
          text2="Ora"
          as="h1"
          align="center"
          className="mb-4"
          textContainerClassName="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900"
          lineClassName="bg-blue-600 w-16 md:w-24 h-1.5"
        />
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Siamo qui per rispondere a tutte le tue domande. Compila il modulo sottostante o utilizza i nostri contatti diretti.
        </p>
      </section>

      {/* Sezione Modulo di Contatto e Informazioni */}
      <section className="flex flex-col lg:flex-row gap-12 mb-16 md:mb-24">
        {/* Modulo di Contatto */}
        <div className="lg:w-2/3 bg-white p-8 rounded-lg shadow-xl border border-gray-100">
          <Title
            text1="Invia un"
            text2="Messaggio"
            as="h2"
            className="mb-8"
            textContainerClassName="text-2xl md:text-3xl font-bold text-gray-800"
            lineClassName="bg-blue-500 w-10 h-1"
          />
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <TextInput
              id="contactName"
              name="name"
              label="Nome Completo"
              type="text"
              placeholder="Il tuo nome e cognome"
              value={formData.name}
              onChange={handleChange}
              error={formErrors.name}
              disabled={isSubmitting}
            />
            <TextInput
              id="contactEmail"
              name="email"
              label="Email"
              type="email"
              placeholder="La tua email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              disabled={isSubmitting}
            />
            <TextInput
              id="contactSubject"
              name="subject"
              label="Oggetto"
              type="text"
              placeholder="Es. Richiesta informazioni, Supporto"
              value={formData.subject}
              onChange={handleChange}
              error={formErrors.subject}
              disabled={isSubmitting}
            />
            <TextInput
              id="contactMessage"
              name="message"
              label="Messaggio"
              type="textarea" // Use type='textarea' for multi-line input
              placeholder="Scrivi qui il tuo messaggio..."
              value={formData.message}
              onChange={handleChange}
              error={formErrors.message}
              disabled={isSubmitting}
            // Add rows for textarea, if TextInput supports it
            // rows={5}
            />
            <Button
              type="submit"
              fullWidth
              size="lg"
              variant="primary"
              className="mt-4 font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Invio in corso...' : 'Invia Messaggio'}
            </Button>
          </form>
        </div>

        {/* Informazioni di Contatto */}
        <div className="lg:w-1/3 bg-white p-8 rounded-lg shadow-xl border border-gray-100 flex flex-col gap-8">
          <Title
            text1="Le Nostre"
            text2="Info"
            as="h2"
            className="mb-4"
            textContainerClassName="text-2xl md:text-3xl font-bold text-gray-800"
            lineClassName="bg-blue-500 w-10 h-1"
          />
          <div className="flex items-center gap-4 text-gray-700">
            <Mail className="w-6 h-6 text-gray-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Email</h3>
              <p className="text-sm">supporto@tuonegozi.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-700">
            <Phone className="w-6 h-6 text-gray-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Telefono</h3>
              <p className="text-sm">+39 012 3456789</p>
            </div>
          </div>
          <div className="flex items-start gap-4 text-gray-700">
            <MapPin className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Indirizzo</h3>
              <p className="text-sm">Via Esempio, 123</p>
              <p className="text-sm">00100 Roma, Italia</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
