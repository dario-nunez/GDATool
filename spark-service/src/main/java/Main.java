import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class Main {
    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(5005), 0);
        server.createContext("/spark-submit", new Triggerer());
        server.createContext("/test", new Test());
        server.setExecutor(null);
        server.start();
    }

    static class Triggerer implements HttpHandler {
        public void handle(HttpExchange httpExchange) throws IOException {
            String submitScript = "./bin/spark-submit --class org.apache.spark.examples.SparkPi " +
                    "--master spark://d5dfb1fe502c:7077 /spark/examples/jars/spark-examples_2.11-2.4.4.jar";
            Process process = Runtime.getRuntime().exec(submitScript);
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

    static class Test implements HttpHandler {
        public void handle(HttpExchange httpExchange) throws IOException {
            String lsScript = "ls";
            Process process = Runtime.getRuntime().exec(lsScript);
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
