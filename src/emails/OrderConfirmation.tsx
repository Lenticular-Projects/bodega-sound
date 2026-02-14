import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
    Link,
    Row,
    Column,
} from "@react-email/components";
import * as React from "react";

interface OrderEmailProps {
    customerName: string;
    orderId: string;
    productName: string;
    totalPrice: string;
}

export const OrderEmail = ({
    customerName = "Valued Customer",
    orderId = "BS-XXXX",
    productName = "Sample Product",
    totalPrice = "₱0.00",
}: OrderEmailProps) => (
    <Html>
        <Head />
        <Preview>Order Received: {productName}</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={logoSection}>
                    <Img
                        src="https://bodega-sound.vercel.app/images/logo/bdg-yellow.png"
                        width="120"
                        height="auto"
                        alt="Bodega Sound"
                        style={logo}
                    />
                </Section>
                <Heading style={h1}>ORDER SECURED</Heading>
                <Text style={text}>
                    Yo {customerName.split(" ")[0]}, we&apos;ve logged your order for <strong>{productName}</strong>.
                </Text>
                <Section style={detailsContainer}>
                    <Row>
                        <Column>
                            <Text style={label}>ORDER ID</Text>
                            <Text style={value}>#{orderId}</Text>
                        </Column>
                        <Column>
                            <Text style={label}>TOTAL PAID</Text>
                            <Text style={value}>{totalPrice}</Text>
                        </Column>
                    </Row>
                </Section>

                <Hr style={hr} />

                <Text style={footerText}>
                    Our team is currently verifying your GCash receipt. Once confirmed, you&apos;ll receive another email with shipping updates.
                </Text>

                <Text style={footerTextSecondary}>
                    Welcome to the collective.
                </Text>

                <Hr style={hr} />

                <Text style={footerLink}>
                    <Link href="https://bodegasound.com" style={link}>BODEGASOUND.COM</Link>
                </Text>
            </Container>
        </Body>
    </Html>
);

export default OrderEmail;

const main = {
    backgroundColor: "#0A0A08",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "40px 20px",
    width: "560px",
};

const logoSection = {
    marginBottom: "40px",
    textAlign: "center" as const,
};

const logo = {
    margin: "0 auto",
};

const h1 = {
    color: "#E5FF00",
    fontSize: "48px",
    fontWeight: "bold",
    letterSpacing: "-0.04em",
    lineHeight: "1",
    margin: "16px 0",
    textAlign: "center" as const,
    textTransform: "uppercase" as const,
};

const text = {
    color: "#FFFFFF",
    fontSize: "16px",
    lineHeight: "24px",
    textAlign: "center" as const,
};

const detailsContainer = {
    backgroundColor: "#111110",
    border: "1px solid #222220",
    borderRadius: "4px",
    padding: "24px",
    marginTop: "32px",
};

const label = {
    color: "#444440",
    fontSize: "10px",
    fontWeight: "bold",
    letterSpacing: "0.1em",
    margin: "0 0 4px 0",
};

const value = {
    color: "#FFFFFF",
    fontSize: "14px",
    fontWeight: "bold",
    margin: "0",
};

const hr = {
    borderColor: "#222220",
    margin: "32px 0",
};

const footerText = {
    color: "#888880",
    fontSize: "14px",
    lineHeight: "22px",
    textAlign: "center" as const,
};

const footerTextSecondary = {
    color: "#444440",
    fontSize: "10px",
    textAlign: "center" as const,
    textTransform: "uppercase" as const,
    letterSpacing: "0.2em",
    marginTop: "24px",
};

const footerLink = {
    textAlign: "center" as const,
    marginTop: "32px",
};

const link = {
    color: "#E5FF00",
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "0.1em",
    textDecoration: "none",
};
