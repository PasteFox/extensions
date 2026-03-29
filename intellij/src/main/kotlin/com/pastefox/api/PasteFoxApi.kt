package com.pastefox.api

import com.google.gson.Gson
import com.google.gson.annotations.SerializedName
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse

data class CreatePasteRequest(
    val content: String,
    val title: String,
    val visibility: String = "UNLISTED",
    val language: String? = null,
    val expiresAt: String? = null,
)

data class PasteData(
    val id: String = "",
    val slug: String = "",
    val title: String = "",
    val content: String? = null,
    val language: String? = null,
    val visibility: String = "",
)

data class ApiResponse<T>(
    val success: Boolean = false,
    val data: T? = null,
    val error: String? = null,
)

object PasteFoxApi {
    private val client = HttpClient.newHttpClient()
    private val gson = Gson()

    private val EXPIRATION_MS = mapOf(
        "10m" to 10 * 60 * 1000L,
        "1h" to 60 * 60 * 1000L,
        "1d" to 24 * 60 * 60 * 1000L,
        "7d" to 7 * 24 * 60 * 60 * 1000L,
        "30d" to 30 * 24 * 60 * 60 * 1000L,
    )

    fun createPaste(apiKey: String, instanceUrl: String, request: CreatePasteRequest): ApiResponse<PasteData> {
        val body = mutableMapOf<String, Any>(
            "content" to request.content,
            "title" to request.title,
            "visibility" to request.visibility,
        )
        request.language?.let { body["language"] = it }
        request.expiresAt?.let { body["expiresAt"] = it }

        val httpReq = HttpRequest.newBuilder()
            .uri(URI.create("${instanceUrl.trimEnd('/')}/api/v1/pastes"))
            .header("Content-Type", "application/json")
            .header("X-API-Key", apiKey)
            .POST(HttpRequest.BodyPublishers.ofString(gson.toJson(body)))
            .build()

        val res = client.send(httpReq, HttpResponse.BodyHandlers.ofString())
        return gson.fromJson(res.body(), ApiResponse::class.java) as ApiResponse<PasteData>
    }

    fun getPaste(instanceUrl: String, slug: String): ApiResponse<PasteData> {
        val httpReq = HttpRequest.newBuilder()
            .uri(URI.create("${instanceUrl.trimEnd('/')}/api/v1/pastes/$slug"))
            .GET()
            .build()

        val res = client.send(httpReq, HttpResponse.BodyHandlers.ofString())
        return gson.fromJson(res.body(), ApiResponse::class.java) as ApiResponse<PasteData>
    }

    fun getExpirationDate(expiration: String): String? {
        val ms = EXPIRATION_MS[expiration] ?: return null
        return java.time.Instant.now().plusMillis(ms).toString()
    }
}
