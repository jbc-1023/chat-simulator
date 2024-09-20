import BottomBar from "@/components/bottomBar";
import TopBar from "@/components/topBar";
import { generalDescription } from "@/defaults";
import Head from "next/head";

export default function TermsOfService(){ 
    return (
        <>
            <Head>
                <title>Swipe Up Stories - Terms of Service</title>
                <meta name="description" content={generalDescription} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/images/assets/favicon.ico" />
            </Head>
            <div className="background_color tos" />
            <TopBar />
            <div className="tos_container">
                <div className="tldr">
                    <h1>TL;DR: <br />DON'T BE AN ASSHOLE.</h1><br />
                    <div className="scroll">Scroll down for details...</div>
                </div>
                <h1>Welcome to our SwipeUpStories.com and will be referred to hereforth as "Platform". </h1><br />
                <p>By using the Platform, you agree to these Terms of Service "Terms", so please read them carefully.</p><br />
                <br />
                <h2>1. User Content</h2>
                <br />
                <p>The Platform allows users to submit, upload, publish, and share content, including but not limited to text, photos, videos, and other materials ("User Content"). You are solely responsible for your User Content and the consequences of posting, publishing, or sharing it. By submitting User Content to the Platform, you grant us a non-exclusive, royalty-free, transferable, sub-licensable, worldwide license to use, reproduce, distribute, prepare derivative works of, display, and perform the User Content in connection with the Platform and our business, including for promoting and redistributing part or all of the Platform in any media formats and through any media channels.</p>
                <br />
                <h2>2. Prohibited Content</h2>
                <br />
                <p>You may not post, publish, or share any User Content that is or could be interpreted as:</p>
                <br />
                <ol>
                    <li>Illegal, harmful, or offensive content</li>
                    <li>False, misleading, or defamatory statements</li>
                    <li>Content that infringes on the intellectual property rights of others</li>
                    <li>Content that violates the privacy or publicity rights of others</li>
                    <li>Content that encourages or incites violence or discrimination based on race, gender, sexual orientation, religion, or other personal characteristics.</li>
                    <li>We reserve the right to remove any User Content that violates these Terms or is otherwise objectionable in our sole discretion.</li>
                </ol>
                <br />
                <h2>3. User Conduct</h2>
                <br />
                <p>In addition to complying with these Terms, you agree to use the Platform responsibly and not to engage in any of the following activities:</p>
                <br />
                <ol>
                    <li>Harassment, bullying, or intimidation of others</li>
                    <li>Impersonation of another person or entity</li>
                    <li>Posting or sharing viruses or malicious code</li>
                    <li>Interfering with or disrupting the Platform's infrastructure, security, or functionality</li>
                    <li>Collecting or harvesting any personally identifiable information from the Platform</li>
                    <li>Using the Platform for any illegal, fraudulent, or unauthorized purpose.</li>
                </ol>
                <br />
                <h2>4. Intellectual Property</h2>
                <br />
                <p>All content and materials on the Platform, including but not limited to logos, trademarks, text, graphics, images, and software, are the property of the Platform or its licensors and are protected by copyright, trademark, and other intellectual property laws. You may not copy, reproduce, distribute, or create derivative works based on any content on the Platform without our prior written consent.</p>
                <br />
                <h2>5. Disclaimer of Warranties</h2>
                <br />
                <p>The Platform is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not guarantee that the Platform will be uninterrupted or error-free, and we are not responsible for any harm caused by the Platform.</p>
                <br />
                <h2>6. Limitation of Liability</h2>
                <br />
                <p>To the fullest extent permitted by law, we will not be liable for any damages of any kind arising from the use of the Platform, including but not limited to direct, indirect, incidental, punitive, and consequential damages.</p>
                <br />
                <h2>7. ndemnification</h2>
                <br />
                <p>You agree to indemnify and hold us harmless from any claim or demand, including reasonable attorneys' fees, made by any third party due to or arising out of your use of the Platform, your User Content, or your violation of these Terms.</p>
                <br />
                <h2>8. Governing Law and Jurisdiction</h2>
                <br />
                <p>These Terms and any dispute arising out of or related to them will be governed by and construed in accordance with the laws of the jurisdiction in which the Platform operates. Any legal action or proceeding arising out of or related to these Terms must be brought in a court of competent jurisdiction in that jurisdiction.</p>
                <br />
                <h2>9. Modifications to Terms</h2>
                <br />
                <p>We reserve the right to modify these Terms at any time, and we will post the revised Terms on the Platform. Your continued use of the posting of any modified Terms constitutes your agreement to be bound by such modified Terms.</p>
                <br />
                <h2>10. Termination</h2>
                <br />
                <p>We reserve the right to suspend or terminate your access to the Platform at any time and for any reason without notice to you. Upon termination, you will no longer have access to the Platform or your User Content.</p>
                <br />
                <h2>11. Miscellaneous</h2>
                <br />
                <p>These Terms constitute the entire agreement between you and us regarding your use of the Platform. If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect. Our failure to enforce any right or provision of these Terms will not be deemed a waiver of such right or provision. These Terms do not create any agency, partnership, joint venture, or employment relationship, and you may not assign or transfer your rights or obligations under these Terms without our prior written consent.</p>    
           </div>
           <BottomBar />
        </>
    )
}