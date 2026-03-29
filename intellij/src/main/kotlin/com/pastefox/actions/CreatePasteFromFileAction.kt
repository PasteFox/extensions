package com.pastefox.actions

import com.intellij.notification.NotificationGroupManager
import com.intellij.notification.NotificationType
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.CommonDataKeys
import com.intellij.openapi.ide.CopyPasteManager
import com.intellij.openapi.progress.ProgressIndicator
import com.intellij.openapi.progress.ProgressManager
import com.intellij.openapi.progress.Task
import com.intellij.openapi.ui.Messages
import com.pastefox.api.CreatePasteRequest
import com.pastefox.api.PasteFoxApi
import com.pastefox.settings.PasteFoxSettings
import java.awt.datatransfer.StringSelection

class CreatePasteFromFileAction : AnAction() {

    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project
        val virtualFile = e.getData(CommonDataKeys.VIRTUAL_FILE) ?: return
        val content = String(virtualFile.contentsToByteArray(), Charsets.UTF_8)

        if (content.isBlank()) {
            Messages.showWarningDialog("File is empty.", "PasteFox")
            return
        }

        val settings = PasteFoxSettings.getInstance().state
        if (settings.apiKey.isBlank()) {
            Messages.showWarningDialog("No API key configured. Go to Settings > Tools > PasteFox.", "PasteFox")
            return
        }

        val fileName = virtualFile.name
        val langExt = virtualFile.extension?.lowercase()
        val expiresAt = PasteFoxApi.getExpirationDate(settings.defaultExpiration)

        ProgressManager.getInstance().run(object : Task.Backgroundable(project, "PasteFox: Creating paste...", false) {
            override fun run(indicator: ProgressIndicator) {
                try {
                    val result = PasteFoxApi.createPaste(
                        settings.apiKey, settings.instanceUrl,
                        CreatePasteRequest(content, fileName, settings.defaultVisibility, langExt, expiresAt)
                    )

                    if (result.success && result.data != null) {
                        val slug = (result.data as? Map<*, *>)?.get("slug")?.toString() ?: ""
                        val pasteUrl = "${settings.instanceUrl.trimEnd('/')}/$slug"

                        if (settings.copyToClipboard) {
                            CopyPasteManager.getInstance().setContents(StringSelection(pasteUrl))
                        }

                        NotificationGroupManager.getInstance()
                            .getNotificationGroup("PasteFox")
                            .createNotification("Paste created: $pasteUrl", NotificationType.INFORMATION)
                            .notify(project)

                        if (settings.openInBrowser) {
                            com.intellij.ide.BrowserUtil.browse(pasteUrl)
                        }
                    } else {
                        NotificationGroupManager.getInstance()
                            .getNotificationGroup("PasteFox")
                            .createNotification("Failed: ${result.error ?: "Unknown error"}", NotificationType.ERROR)
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

    override fun update(e: AnActionEvent) {
        e.presentation.isEnabledAndVisible = e.getData(CommonDataKeys.VIRTUAL_FILE) != null
    }
}
