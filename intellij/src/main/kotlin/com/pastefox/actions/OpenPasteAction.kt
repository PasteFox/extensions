package com.pastefox.actions

import com.intellij.notification.NotificationGroupManager
import com.intellij.notification.NotificationType
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.fileEditor.FileEditorManager
import com.intellij.openapi.progress.ProgressIndicator
import com.intellij.openapi.progress.ProgressManager
import com.intellij.openapi.progress.Task
import com.intellij.openapi.ui.Messages
import com.intellij.testFramework.LightVirtualFile
import com.pastefox.api.PasteFoxApi
import com.pastefox.settings.PasteFoxSettings

class OpenPasteAction : AnAction() {

    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        val settings = PasteFoxSettings.getInstance().state

        val input = Messages.showInputDialog(
            project,
            "Enter paste slug or URL:",
            "PasteFox: Open Paste",
            null,
            "",
            null
        ) ?: return

        val slug = input.replace(Regex("^https?://[^/]+/"), "").trimEnd('/')
        if (slug.isBlank()) return

        ProgressManager.getInstance().run(object : Task.Backgroundable(project, "PasteFox: Fetching paste...", false) {
            override fun run(indicator: ProgressIndicator) {
                try {
                    val result = PasteFoxApi.getPaste(settings.instanceUrl, slug)

                    if (result.success && result.data != null) {
                        val data = result.data as? Map<*, *> ?: return
                        val content = data["content"]?.toString() ?: ""
                        val language = data["language"]?.toString() ?: "txt"
                        val title = data["title"]?.toString() ?: slug

                        ApplicationManager.getApplication().invokeLater {
                            val file = LightVirtualFile("$title.$language", content)
                            FileEditorManager.getInstance(project).openFile(file, true)
                        }
                    } else {
                        NotificationGroupManager.getInstance()
                            .getNotificationGroup("PasteFox")
                            .createNotification("Paste not found: ${result.error ?: slug}", NotificationType.WARNING)
                            .notify(project)
                    }
                } catch (ex: Exception) {
                    NotificationGroupManager.getInstance()
                        .getNotificationGroup("PasteFox")
                        .createNotification("Error: ${ex.message}", NotificationType.ERROR)
                        .notify(project)
                }
            }
        })
    }
}
