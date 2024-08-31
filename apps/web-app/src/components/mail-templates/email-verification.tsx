import 'server-only';

import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface EmailVerificationProps {
  email?: string;
  code?: string;
}

const baseUrl = process.env.HOST_NAME as string;

export const EmailVerification = ({ email, code }: EmailVerificationProps) => {
  return (
    <Html>
      <Head />
      <Preview>TheNextStartup has sent you an email verification</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/static/dropbox-logo.png`}
            width="40"
            height="33"
            alt="TheNextStartup"
          />
          <Section>
            <Text style={text}>Hi {email},</Text>
            <Text style={text}>
              Thank you for signing up to our app. Here is a verification code{' '}
              {'\n'}
              {code} that is valid for 5 minutes.
            </Text>
            <Text style={text}>Thank you!</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailVerification;

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
};

const text = {
  fontSize: '16px',
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: '300',
  color: '#404040',
  lineHeight: '26px',
};

const button = {
  backgroundColor: '#000000',
  borderRadius: '4px',
  color: '#fff',
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '14px 7px',
};

const anchor = {
  textDecoration: 'underline',
};
