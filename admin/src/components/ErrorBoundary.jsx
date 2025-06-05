import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary ha catturato un errore:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-red-800 p-6 rounded-lg shadow-xl m-4">
                    <h1 className="text-3xl font-bold mb-4 text-red-900">Qualcosa è andato storto!</h1>
                    <p className="text-lg text-center mb-6">
                        Ci scusiamo per l'inconveniente. Stiamo lavorando per risolvere il problema.
                    </p>
                    {this.state.error && (
                        <details className="mt-4 p-3 bg-red-200 rounded-md text-sm cursor-pointer w-full max-w-md">
                            <summary className="font-semibold text-red-700">Dettagli errore (clicca per espandere)</summary>
                            <pre className="whitespace-pre-wrap break-words text-left mt-2 p-2 bg-red-50 rounded-md overflow-auto max-h-48">
                                {this.state.error.toString()}
                                <br />
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </details>
                    )}
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 px-8 py-4 bg-red-600 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 transition duration-300 transform hover:scale-105"
                    >
                        Ricarica la pagina
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;