import Alert from "react-bootstrap/Alert";

export default function CustomAlertDismissable({ show, setShow, variant, heading, message }) {
    if (show) {
        return (
            <Alert variant={variant} onClose={() => setShow(false)} dismissible>
                <Alert.Heading>{heading}</Alert.Heading>
                <p>
                    {message}
                </p>
            </Alert>
        );
    }
    return null;
}