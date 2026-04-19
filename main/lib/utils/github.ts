import { Octokit } from "@octokit/rest";

export async function getGitHubClient(token: string) {
  return new Octokit({
    auth: token,
  });
}

export async function getWorkflowRuns(
  token: string,
  owner: string,
  repo: string,
  limit: number = 10,
) {
  try {
    const octokit = await getGitHubClient(token);

    const response = await octokit.actions.listWorkflowRunsForRepo({
      owner,
      repo,
      per_page: limit,
    });

    return response.data.workflow_runs.map((run: any) => ({
      id: run.id,
      name: run.name,
      workflowName: run.workflow_id ? `Workflow ${run.workflow_id}` : run.name,
      status: run.status,
      conclusion: run.conclusion,
      branch: run.head_branch,
      commitSha: run.head_commit?.sha,
      commitMessage: run.head_commit?.message,
      createdAt: new Date(run.created_at),
      updatedAt: new Date(run.updated_at),
      completedAt: run.completed_at ? new Date(run.completed_at) : null,
      htmlUrl: run.html_url,
      headCommit: run.head_commit,
    }));
  } catch (error) {
    console.error("Error fetching workflow runs:", error);
    throw error;
  }
}

export async function getWorkflowRunLogs(
  token: string,
  owner: string,
  repo: string,
  runId: number,
) {
  try {
    const octokit = await getGitHubClient(token);

    // Get the workflow run details
    const runResponse = await octokit.actions.getWorkflowRun({
      owner,
      repo,
      run_id: runId,
    });

    // Get logs artifact URL
    const logsUrl = runResponse.data.logs_url;

    if (logsUrl) {
      const logsResponse = await fetch(logsUrl, {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github+json",
        },
      });

      if (logsResponse.ok) {
        const buffer = await logsResponse.arrayBuffer();
        const combinedLogs = await extractAndCombineLogsFromZip(buffer);
        return combinedLogs;
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching workflow run logs:", error);
    throw error;
  }
}

export async function getRepositoryInfo(
  token: string,
  owner: string,
  repo: string,
) {
  try {
    const octokit = await getGitHubClient(token);

    const response = await octokit.repos.get({
      owner,
      repo,
    });

    return {
      name: response.data.name,
      fullName: response.data.full_name,
      description: response.data.description,
      url: response.data.html_url,
      owner: response.data.owner?.login,
    };
  } catch (error) {
    console.error("Error fetching repository info:", error);
    throw error;
  }
}

export async function testGitHubToken(token: string) {
  try {
    const octokit = await getGitHubClient(token);
    const response = await octokit.users.getAuthenticated();
    return {
      valid: true,
      user: response.data.login,
    };
  } catch (error) {
    return {
      valid: false,
      user: null,
    };
  }
}

// Helper function to extract and combine logs from ZIP file
async function extractAndCombineLogsFromZip(
  buffer: ArrayBuffer,
): Promise<string> {
  const AdmZip = require("adm-zip");

  try {
    const zip = new AdmZip(Buffer.from(buffer));
    const zipEntries = zip.getEntries();

    const logFiles: {
      name: string;
      content: string;
      order: number;
    }[] = [];

    zipEntries.forEach((entry: any) => {
      const fileName = entry.entryName;
      const ext = fileName.split(".").pop();

      if (ext === "txt" && !entry.isDirectory) {
        const content = entry.getData().toString("utf-8");

        // Extract step order from filename (e.g., "2_Checkout code.txt" -> 2)
        const match = fileName.match(/^(\d+)_/);
        const order = match ? parseInt(match[1], 10) : 9999;
        const name = fileName
          .replace(/^[0-9_]+/, "")
          .replace(".txt", "")
          .trim();

        logFiles.push({ name, content, order });
      }
    });

    // Sort by order and combine
    const sorted = logFiles.sort((a, b) => a.order - b.order);
    const combined = sorted
      .map(
        (file) =>
          `${"=".repeat(60)}\n${file.name.toUpperCase()}\n${"=".repeat(60)}\n${file.content}\n`,
      )
      .join("\n");

    return combined || "No logs available";
  } catch (error) {
    console.error("Error extracting logs from ZIP:", error);
    throw new Error("Failed to extract workflow logs");
  }
}
