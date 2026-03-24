import { getAdminPosts } from '@/lib/blog/posts'
import { AdminBlogPostRowActions } from '@/components/admin/AdminBlogPostRowActions'

export default async function AdminPostedBlogsPage() {
  const posts = await getAdminPosts()

  return (
    <div className="w-full max-w-4xl px-4 py-8 md:px-8 md:py-10">
      <h1 className="mb-2 text-2xl font-bold tracking-tight">Posted blogs</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Posts from <code className="rounded bg-muted px-1 text-xs">content/blog</code> and Supabase (merged).
        Same slug in both shows the Supabase version on the site. Edit updates that copy; delete removes every copy
        we find.
      </p>

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts yet. Create one from New post.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border/80">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="hidden px-4 py-3 lg:table-cell">Storage</th>
                <th className="hidden px-4 py-3 sm:table-cell">Category</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/80 bg-card">
              {posts.map((post) => {
                const storageLabel =
                  post.sources.supabase && post.sources.filesystem
                    ? 'Supabase + file'
                    : post.sources.supabase
                      ? 'Supabase'
                      : 'File'
                return (
                  <tr key={post.slug} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <p className="font-medium leading-snug">{post.title}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">/{post.slug}</p>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{storageLabel}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{post.category}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{post.date}</td>
                    <td className="px-4 py-3 text-right">
                      <AdminBlogPostRowActions slug={post.slug} title={post.title} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
