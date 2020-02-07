import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class Main {
    private static String submitScript = "./bin/spark-submit --class org.apache.spark.examples.SparkPi " +
            "--master spark://ee91bc61c5cc:7077 /spark/examples/jars/spark-examples_2.11-2.4.4.jar 100";
    private static String lsScript = "ls";

    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(5005), 0);
        server.createContext("/spark-submit", new Triggerer(lsScript));
        server.setExecutor(null);
        server.start();
    }

    static class Triggerer implements HttpHandler {
        String script;

        public Triggerer(String script) {
            this.script = script;
        }

        public void handle(HttpExchange httpExchange) throws IOException {
            Process process = Runtime.getRuntime().exec(script);
            String output = "";
            try {
                process.waitFor();
                BufferedReader stdin = new BufferedReader(new InputStreamReader(process.getInputStream()));
                String currentStdin = "";

                while ((currentStdin = stdin.readLine()) != null) {
                    output = output + currentStdin;
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            String response = "Response, " + output;
            httpExchange.sendResponseHeaders(200, response.length());
            OutputStream outputStream = httpExchange.getResponseBody();
            outputStream.write(response.getBytes());
            outputStream.close();
        }
    }
}
