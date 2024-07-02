#include <errno.h>
#include <netdb.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <string.h>
#include <unistd.h>
// A ajouter : Creer
#include <stdio.h>
#include <stdlib.h>
int max_fds;
char *BUF[70000];
fd_set Read;
fd_set Write;
fd_set Fds;
//
int extract_message(char **buf, char **msg)
{
    char    *newbuf;
    int    i;
    *msg = 0;
    if (*buf == 0)
        return (0);
    i = 0;
    while ((*buf)[i])
    {
        if ((*buf)[i] == '\n')
        {
            newbuf = calloc(1, sizeof(newbuf) * (strlen(*buf + i + 1) + 1));
            if (newbuf == 0)
                return (-1);
            strcpy(newbuf, *buf + i + 1);
            *msg = *buf;
            (*msg)[i + 1] = 0;
            *buf = newbuf;
            return (1);
        }
        i++;
    }
    return (0);
}
char *str_join(char* buf, char *add)
{
    char    *newbuf;
    int        len;
    if (buf == 0)
        len = 0;
    else
        len = strlen(buf);
    newbuf = malloc(sizeof(*newbuf) * (len + strlen(add) + 1));
    if (newbuf == 0)
        return (0);
    newbuf[0] = 0;
    if (buf != 0)
        strcat(newbuf, buf);
    free(buf);
    strcat(newbuf, add);
    return (newbuf);
}
// A apprendre : creer
void send_message(int fd, char *msg) {
    for (int i = 0; i <= max_fds; i++) {
        if (i != fd && FD_ISSET(i, &Write))
            send(i, msg, strlen(msg), 0);
    }
}
 // A apprendre : creer
void read_message(int fd, char *msg, int id) {
    char *buf;
    BUF[fd] = str_join(BUF[fd], msg);
    while (extract_message(&BUF[fd], &buf)) {
        char msg[100];
        sprintf(msg, "client %d: ", id);
        send_message(fd, msg);
        send_message(fd, buf);
        free(buf);
    }
}
int main(int ac, char **av) {
    // A apprendre : creer
    if (ac != 2) {
        write(1, "Wrong number of arguments\n", strlen("Wrong number of arguments\n"));
        exit(1);
    }
    //
    int sockfd, connfd;
    // A apprendre : modifier
    socklen_t len;
    //
    struct sockaddr_in servaddr, cli;
    // socket create and verification
    sockfd = socket(AF_INET, SOCK_STREAM, 0);
    // A apprendre : modifier
    if (sockfd == -1) {
        write(1, "Fatal error\n", strlen("Fatal error\n"));
        exit(1);
    }
    //
    bzero(&servaddr, sizeof(servaddr));
    // assign IP, PORT
    servaddr.sin_family = AF_INET;
    servaddr.sin_addr.s_addr = htonl(2130706433); //127.0.0.1
    // A apprendre : modifier
    servaddr.sin_port = htons(atoi(av[1]));
    //
    // Binding newly created socket to given IP and verification
    // A apprendre : modifier
    if ((bind(sockfd, (const struct sockaddr *)&servaddr, sizeof(servaddr))) != 0) {
        write(1, "Fatal error\n", strlen("Fatal error\n"));
        exit(1);
    }
    //
    // A apprendre : modifier
    if (listen(sockfd, 10) != 0) {
        write(1, "Fatal error\n", strlen("Fatal error\n"));
        exit(1);
    }
    //
    len = sizeof(cli);
    // A apprendre : Creer
    FD_SET(sockfd, &Fds);
    max_fds = sockfd;
    int users_fd[4000];
    int id = 0;
    while (1) {
        Read = Write = Fds;
        select(max_fds + 1, &Read, &Write, NULL, NULL);
        for (int i = 0; i <= max_fds; i++) {
            if (FD_ISSET(i, &Read)) {
                if (i == sockfd) {
                    connfd = accept(sockfd, (struct sockaddr *)&cli, &len);
                    FD_SET(connfd, &Fds);
                    if (connfd > max_fds)
                        max_fds = connfd;
                    users_fd[connfd] = id;
                    char msg[200];
                    sprintf(msg, "server: client %d just joined\n", id);
                    send_message(connfd, msg);
                    id++;
                    memset(msg, 0, 200);
                }
                else {
                    char receiv[4096];
                    int rec = recv(i, receiv, 4096, 0);
                    if (rec <= 0) {
                        char msg[200];
                        sprintf(msg, "server: client %d just left\n", users_fd[i]);
                        send_message(i, msg);
                        close(i);
                        FD_CLR(i, &Fds);
                    }
                    else {
                        receiv[rec] = '\0';
                        read_message(i, receiv, users_fd[i]);
                    }
                }
            }
        }
    }//
    return 0;
}