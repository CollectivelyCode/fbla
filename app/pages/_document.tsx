import {createGetInitialProps} from "@mantine/next"
import newrelic from "newrelic"
import Document, {DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript} from "next/document"

const getInitialProps = createGetInitialProps()

export default class _Document extends Document<NewRelicProps> {
    static async getInitialProps(
        ctx: DocumentContext
    ): Promise<DocumentInitialProps & NewRelicProps> {
        const initialProps = await Document.getInitialProps(ctx);
        if (!newrelic.agent.collector.isConnected()) {
            await new Promise((resolve) => {
                newrelic.agent.on("connected", resolve);
            });
        }

        const browserTimingHeader = newrelic.getBrowserTimingHeader({
            hasToRemoveScriptWrapper: true,
            allowTransactionlessInjection: true,
        });

        return {
            ...initialProps,
            browserTimingHeader,
        };
    }
    render(): JSX.Element {
        return (
            <Html>
                <Head>
                    <script
                        type="text/javascript"
                        dangerouslySetInnerHTML={{ __html: this.props.browserTimingHeader }}
                    />
                </Head>
                <body>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        )
    }
}
type NewRelicProps = {
    browserTimingHeader: string;
};