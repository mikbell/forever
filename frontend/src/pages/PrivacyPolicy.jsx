import React from 'react';
import { Link } from 'react-router-dom'; // Assicurati di avere react-router-dom installato
import Title from '../components/Title'; // Assicurati che il percorso sia corretto

const PrivacyPolicy = () => {
    return (
        <div className='container mx-auto px-4 py-8 md:py-12'>
            {/* Sezione Titolo Principale */}
            <section className="text-center mb-12 md:mb-16">
                <Title
                    text1="Informativa sulla"
                    text2="Privacy"
                    as="h1"
                    align="center"
                    className="mb-4"
                    textContainerClassName="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900"
                />
                <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                    Ultimo aggiornamento: 1 Giugno 2025
                </p>
                <p className="text-md text-gray-600 max-w-3xl mx-auto leading-relaxed mt-4">
                    Benvenuti su <strong className="text-gray-800">Forever</strong>. La vostra privacy è di fondamentale importanza per noi. Questa Informativa sulla Privacy spiega come raccogliamo, utilizziamo, divulghiamo e proteggiamo le vostre informazioni personali quando visitate il nostro sito web, effettuate acquisti o interagite con i nostri servizi.
                </p>
                <p className="text-md text-gray-600 max-w-3xl mx-auto leading-relaxed mt-2">
                    Utilizzando il Sito, acconsentite alla raccolta e all'uso delle informazioni in conformità con questa politica.
                </p>
            </section>

            {/* Sezione 1: Informazioni che Raccogliamo */}
            <section className="mb-12 md:mb-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">1. Informazioni che Raccogliamo</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    Raccogliamo diverse tipologie di informazioni per varie finalità, al fine di fornirvi e migliorare il nostro servizio.
                </p>

                {/* Sottosezione 1.1: Dati Personali Forniti da Voi */}
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">1.1. Dati Personali Forniti da Voi</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                    Quando interagite con il nostro Sito, potremmo raccogliere le seguenti informazioni personali che ci fornite direttamente:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                    <li><strong>Dati di Registrazione:</strong> Nome, cognome, indirizzo email, password (criptata).</li>
                    <li><strong>Dati di Ordine e Spedizione:</strong> Indirizzo di spedizione (via, numero civico, città, provincia, CAP, nazione), indirizzo di fatturazione (se diverso), numero di telefono.</li>
                    <li><strong>Dati di Pagamento:</strong> Informazioni necessarie per elaborare i pagamenti (ad esempio, dettagli della carta di credito/debito, PayPal), che vengono gestite direttamente dai nostri processori di pagamento sicuri e non vengono memorizzate sui nostri server.</li>
                    <li><strong>Comunicazioni:</strong> Contenuto delle comunicazioni quando ci contattate via email, modulo di contatto o altri mezzi.</li>
                    <li><strong>Recensioni e Feedback:</strong> Contenuto delle recensioni di prodotti o feedback che ci fornite.</li>
                </ul>

                {/* Sottosezione 1.2: Dati Raccolti Automaticamente */}
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">1.2. Dati Raccolti Automaticamente</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                    Quando navigate sul nostro Sito, potremmo raccogliere automaticamente alcune informazioni:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>Dati di Navigazione:</strong> Indirizzo IP, tipo di browser, sistema operativo, pagine visitate, data e ora della visita, tempo trascorso sulle pagine, percorsi di navigazione sul Sito.</li>
                    <li><strong>Dati del Dispositivo:</strong> Tipo di dispositivo mobile, ID univoci del dispositivo, identificatori pubblicitari, informazioni sulla rete mobile.</li>
                    <li>
                        <strong>Cookie e Tecnologie Simili:</strong> Utilizziamo cookie e tecnologie di tracciamento simili per monitorare l'attività sul nostro Sito e conservare determinate informazioni. Per maggiori dettagli, consultate la nostra{' '}
                        <Link to="/cookie-policy" className="text-blue-600 hover:underline">Informativa sui Cookie</Link>.
                    </li>
                </ul>
            </section>

            {/* Sezione 2: Come Utilizziamo le Vostre Informazioni */}
            <section className="mb-12 md:mb-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">2. Come Utilizziamo le Vostre Informazioni</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    Utilizziamo le informazioni raccolte per varie finalità:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>Fornire e Mantenere il Servizio:</strong> Per operare e mantenere il nostro Sito, elaborare gli ordini e gestire le transazioni.</li>
                    <li><strong>Gestire il Vostro Account:</strong> Per gestire la vostra registrazione come utente del Sito e fornirvi l'accesso alle funzionalità riservate.</li>
                    <li><strong>Elaborare gli Ordini:</strong> Per elaborare i vostri acquisti, consegnare i prodotti e gestire resi o rimborsi.</li>
                    <li><strong>Comunicazioni:</strong> Per inviarvi email di conferma ordine, aggiornamenti sullo stato della spedizione, risposte alle vostre richieste di supporto e, se avete acconsentito, comunicazioni di marketing.</li>
                    <li><strong>Personalizzazione:</strong> Per personalizzare la vostra esperienza sul Sito, mostrandovi prodotti e offerte pertinenti.</li>
                    <li><strong>Miglioramento del Servizio:</strong> Per analizzare come il nostro Sito viene utilizzato, identificare tendenze, migliorare le funzionalità e risolvere problemi tecnici.</li>
                    <li><strong>Sicurezza:</strong> Per prevenire frodi, proteggere la sicurezza del nostro Sito e dei nostri utenti, e garantire la conformità legale.</li>
                    <li><strong>Marketing (con consenso):</strong> Per inviarvi newsletter, promozioni e offerte speciali che riteniamo possano interessarvi, solo se avete fornito il vostro consenso esplicito.</li>
                </ul>
            </section>

            {/* Sezione 3: Come Condividiamo le Vostre Informazioni */}
            <section className="mb-12 md:mb-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">3. Come Condividiamo le Vostre Informazioni</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    Potremmo condividere le vostre informazioni personali con terze parti solo in circostanze specifiche e con adeguate garanzie:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>Fornitori di Servizi:</strong> Condividiamo informazioni con fornitori di servizi terzi che svolgono funzioni per nostro conto (ad esempio, elaborazione dei pagamenti, servizi di spedizione, hosting del sito, analisi dei dati, marketing). Questi fornitori hanno accesso alle informazioni personali solo per eseguire i loro compiti e sono obbligati a non divulgarle o usarle per altri scopi.</li>
                    <li><strong>Processori di Pagamento:</strong> Le informazioni di pagamento vengono condivise direttamente con i processori di pagamento (es. Stripe, PayPal) per l'elaborazione sicura delle transazioni. Non memorizziamo i dettagli completi della vostra carta di credito sui nostri server.</li>
                    <li><strong>Conformità Legale e Sicurezza:</strong> Potremmo divulgare le vostre informazioni se richiesto dalla legge, in risposta a un ordine del tribunale, per proteggere i nostri diritti o la sicurezza di altri, o per indagare su frodi o violazioni dei termini di servizio.</li>
                    <li><strong>Trasferimenti Commerciali:</strong> In caso di fusione, acquisizione, vendita di asset o riorganizzazione aziendale, le vostre informazioni personali potrebbero essere trasferite come parte degli asset aziendali.</li>
                    <li><strong>Con il Vostro Consenso:</strong> Potremmo condividere le vostre informazioni con terze parti per qualsiasi altro scopo con il vostro consenso esplicito.</li>
                </ul>
            </section>

            {/* Sezione 4: I Vostri Diritti */}
            <section className="mb-12 md:mb-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">4. I Vostri Diritti</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    In conformità con il Regolamento Generale sulla Protezione dei Dati (GDPR) e altre leggi sulla privacy applicabili, avete i seguenti diritti in relazione ai vostri dati personali:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>Diritto di Accesso:</strong> Richiedere una copia delle informazioni personali che deteniamo su di voi.</li>
                    <li><strong>Diritto di Rettifica:</strong> Richiedere la correzione di informazioni imprecise o incomplete.</li>
                    <li><strong>Diritto alla Cancellazione ("Diritto all'Oblio"):</strong> Richiedere la cancellazione dei vostri dati personali in determinate circostanze.</li>
                    <li><strong>Diritto di Limitazione di Trattamento:</strong> Richiedere la limitazione del trattamento dei vostri dati in determinate circostanze.</li>
                    <li><strong>Diritto alla Portabilità dei Dati:</strong> Ricevere i vostri dati personali in un formato strutturato, di uso comune e leggibile da dispositivo automatico, e trasmetterli a un altro titolare del trattamento.</li>
                    <li><strong>Diritto di Opposizione:</strong> Opporsi al trattamento dei vostri dati personali in determinate circostanze, incluso il trattamento per finalità di marketing diretto.</li>
                    <li><strong>Diritto di Revocare il Consenso:</strong> Revocare il consenso in qualsiasi momento, laddove il trattamento si basi sul consenso.</li>
                    <li><strong>Diritto di Proporre Reclamo:</strong> Presentare un reclamo all'autorità di controllo competente (ad esempio, il Garante per la Protezione dei Dati Personali in Italia).</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                    Per esercitare uno qualsiasi di questi diritti, vi preghiamo di contattarci utilizzando i dettagli forniti nella sezione "Contattaci".
                </p>
            </section>

            {/* Sezione 5: Sicurezza dei Dati */}
            <section className="mb-12 md:mb-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">5. Sicurezza dei Dati</h2>
                <p className="text-gray-700 leading-relaxed">
                    La sicurezza delle vostre informazioni personali è importante per noi. Adottiamo misure di sicurezza tecniche e organizzative appropriate per proteggere i vostri dati da accesso non autorizzato, alterazione, divulgazione o distruzione. Tuttavia, nessun metodo di trasmissione su Internet o metodo di archiviazione elettronica è sicuro al 100%. Pertanto, non possiamo garantire la sicurezza assoluta delle vostre informazioni.
                </p>
            </section>

            {/* Sezione 6: Conservazione dei Dati */}
            <section className="mb-12 md:mb-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">6. Conservazione dei Dati</h2>
                <p className="text-gray-700 leading-relaxed">
                    Conserveremo le vostre informazioni personali solo per il tempo necessario a soddisfare le finalità per cui sono state raccolte, come descritto in questa Informativa sulla Privacy, o per adempiere agli obblighi legali, risolvere controversie e far rispettare i nostri accordi.
                </p>
            </section>

            {/* Sezione 7: Link a Siti di Terze Parti */}
            <section className="mb-12 md:mb-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">7. Link a Siti di Terze Parti</h2>
                <p className="text-gray-700 leading-relaxed">
                    Il nostro Sito può contenere link a siti web di terze parti che non sono gestiti da noi. Se cliccate su un link di terze parti, sarete reindirizzati al sito di tale terza parte. Vi consigliamo vivamente di rivedere l'Informativa sulla Privacy di ogni sito che visitate. Non abbiamo alcun controllo e non ci assumiamo alcuna responsabilità per il contenuto, le politiche sulla privacy o le pratiche di siti o servizi di terze parti.
                </p>
            </section>

            {/* Sezione 8: Privacy dei Minori */}
            <section className="mb-12 md:mb-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">8. Privacy dei Minori</h2>
                <p className="text-gray-700 leading-relaxed">
                    Il nostro Sito non si rivolge a persone di età inferiore ai 18 anni ("Minori"). Non raccogliamo consapevolmente informazioni personali da Minori. Se siete un genitore o tutore e siete a conoscenza che vostro figlio ci ha fornito Dati Personali, vi preghiamo di contattarci. Se veniamo a conoscenza di aver raccolto Dati Personali da un Minore senza verifica del consenso dei genitori, prenderemo provvedimenti per rimuovere tali informazioni dai nostri server.
                </p>
            </section>

            {/* Sezione 9: Modifiche a Questa Informativa sulla Privacy */}
            <section className="mb-12 md:mb-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">9. Modifiche a Questa Informativa sulla Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                    Potremmo aggiornare la nostra Informativa sulla Privacy di tanto in tanto. Vi informeremo di eventuali modifiche pubblicando la nuova Informativa sulla Privacy su questa pagina. Vi consigliamo di rivedere periodicamente questa Informativa sulla Privacy per eventuali modifiche. Le modifiche a questa Informativa sulla Privacy sono efficaci quando vengono pubblicate su questa pagina.
                </p>
            </section>

            {/* Sezione 10: Contattaci */}
            <section className="mb-12 md:mb-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">10. Contattaci</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    Se avete domande o dubbi su questa Informativa sulla Privacy, potete contattarci:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>Tramite email:</strong>{' '}
                        <a href="mailto:supporto@foreveryou.com" className="text-blue-600 hover:underline">supporto@foreveryou.com</a>
                    </li>
                    <li><strong>Tramite modulo di contatto sul nostro sito:</strong>{' '}
                        <Link to="/contact" className="text-blue-600 hover:underline">Link alla pagina Contatti</Link>
                    </li>
                    <li><strong>Tramite posta:</strong> <span className="font-medium">Via Roma 123, 00100 Roma</span></li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                    Grazie per aver scelto <strong className="text-gray-800">Forever</strong>.
                </p>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
