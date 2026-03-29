plugins {
    id("java")
    id("org.jetbrains.kotlin.jvm") version "1.9.25"
    id("org.jetbrains.intellij.platform") version "2.2.1"
}

group = "com.pastefox"
version = "1.0.0"

repositories {
    mavenCentral()
    intellijPlatform {
        defaultRepositories()
    }
}

dependencies {
    intellijPlatform {
        intellijIdeaCommunity("2024.1")
        instrumentationTools()
    }
    implementation("com.google.code.gson:gson:2.11.0")
}

intellijPlatform {
    pluginConfiguration {
        id = "com.pastefox.plugin"
        name = "PasteFox"
        version = project.version.toString()
        description = """
            Share code snippets directly from your JetBrains IDE to <a href="https://pastefox.com">PasteFox</a>.
            <br><br>
            <b>Features:</b>
            <ul>
                <li>Share selection or entire file via right-click or shortcut</li>
                <li>Choose visibility: Public, Unlisted, or Private</li>
                <li>Set expiration: 10m, 1h, 1d, 7d, 30d, or never</li>
                <li>URL copied to clipboard automatically</li>
                <li>Works with PasteFox custom domains</li>
                <li>Supports all JetBrains IDEs</li>
            </ul>
        """.trimIndent()
        changeNotes = """
            <b>1.0.0</b>
            <ul>
                <li>Initial release</li>
                <li>Create paste from selection or file</li>
                <li>Open paste by slug/URL</li>
                <li>Visibility and expiration picker</li>
                <li>Settings panel for API key and preferences</li>
            </ul>
        """.trimIndent()
        ideaVersion {
            sinceBuild = "241"
        }
        vendor {
            name = "PasteFox"
            url = "https://pastefox.com"
            email = "info@pastefox.com"
        }
    }
}

tasks {
    withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
        kotlinOptions.jvmTarget = "17"
    }
}
